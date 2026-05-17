mod app;
mod models;
mod storage;
mod ui;

use std::io;
use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode, KeyEventKind},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{
    backend::CrosstermBackend,
    Terminal,
};
use app::{App, AppMode, Focus};
use models::BlockType;

fn main() -> io::Result<()> {
    let mut app = App::new();

    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    let result = run_app(&mut terminal, &mut app);

    disable_raw_mode()?;
    execute!(
        terminal.backend_mut(),
        LeaveAlternateScreen,
        DisableMouseCapture
    )?;
    terminal.show_cursor()?;

    if let Err(err) = result {
        eprintln!("Error: {}", err);
    }

    Ok(())
}

fn run_app(terminal: &mut Terminal<CrosstermBackend<io::Stdout>>, app: &mut App) -> io::Result<()> {
    loop {
        terminal.draw(|f| ui::render(f, app))?;

        if let Event::Key(key) = event::read()? {
            if key.kind != KeyEventKind::Press {
                continue;
            }

            match app.mode {
                AppMode::Normal => handle_normal_mode(app, key),
                AppMode::Insert => handle_insert_mode(app, key),
                AppMode::Command => handle_command_mode(app, key),
                AppMode::Search => handle_search_mode(app, key),
                AppMode::BlockTypePicker => handle_block_type_picker(app, key),
                AppMode::PageTitle => handle_page_title_mode(app, key),
            }

            if app.should_quit {
                app.save();
                return Ok(());
            }
        }
    }
}

fn handle_normal_mode(app: &mut App, key: event::KeyEvent) {
    match key.code {
        KeyCode::Char('q') => app.should_quit = true,
        KeyCode::Char(':') => {
            app.mode = AppMode::Command;
            app.command_input.clear();
        }
        KeyCode::Char('/') => {
            app.mode = AppMode::Search;
            app.search_input.clear();
        }
        KeyCode::Char('n') => {
            app.create_page("Untitled");
        }
        KeyCode::Char('i') | KeyCode::Enter => {
            app.mode = AppMode::Insert;
        }
        KeyCode::Char('a') => {
            app.show_block_type_picker = true;
            app.mode = AppMode::BlockTypePicker;
        }
        KeyCode::Char('d') => {
            app.delete_block();
        }
        KeyCode::Char('k') => {
            if app.focus == Focus::Sidebar {
                app.navigate_sidebar_up();
            } else {
                if app.selected_block_idx > 0 {
                    app.selected_block_idx -= 1;
                }
            }
        }
        KeyCode::Char('j') => {
            if app.focus == Focus::Sidebar {
                app.navigate_sidebar_down();
            } else {
                if let Some(page) = app.current_page() {
                    if app.selected_block_idx + 1 < page.blocks.len() {
                        app.selected_block_idx += 1;
                    }
                }
            }
        }
        KeyCode::Char('h') | KeyCode::Left => {
            if app.focus == Focus::Editor {
                app.focus = Focus::Sidebar;
            }
        }
        KeyCode::Char('l') | KeyCode::Right => {
            if app.focus == Focus::Sidebar {
                app.select_sidebar_page();
            }
        }
        KeyCode::Char('x') => {
            app.toggle_todo();
        }
        KeyCode::Char('K') => {
            app.move_block_up();
        }
        KeyCode::Char('J') => {
            app.move_block_down();
        }
        KeyCode::Char('s') => {
            app.save();
            app.set_message("Saved!");
        }
        KeyCode::Char('?') => {
            app.set_message("j/k:nav i:edit a:add d:del x:todo K/J:move :cmd /search n:new q:quit");
        }
        _ => {}
    }
}

fn handle_insert_mode(app: &mut App, key: event::KeyEvent) {
    match key.code {
        KeyCode::Esc => {
            app.mode = AppMode::Normal;
        }
        KeyCode::Enter => {
            if let Some(page) = app.current_page() {
                let current_block = &page.blocks[app.selected_block_idx];
                let new_block_type = match current_block.block_type {
                    BlockType::BulletList => BlockType::BulletList,
                    BlockType::NumberedList => BlockType::NumberedList,
                    _ => BlockType::Text,
                };
                if let Some(page) = app.current_page_mut() {
                    page.add_block(new_block_type);
                    app.selected_block_idx = page.blocks.len() - 1;
                }
            }
        }
        KeyCode::Backspace => {
            if let Some(page) = app.current_page() {
                let content = &page.blocks[app.selected_block_idx].content;
                if content.is_empty() {
                    app.delete_block();
                    app.mode = AppMode::Normal;
                } else {
                    let new_content = content.chars().take(content.chars().count() - 1).collect();
                    app.update_current_block(new_content);
                }
            }
        }
        KeyCode::Char(c) => {
            if let Some(page) = app.current_page() {
                let mut content = page.blocks[app.selected_block_idx].content.clone();
                content.push(c);
                app.update_current_block(content);
            }
        }
        _ => {}
    }
}

fn handle_command_mode(app: &mut App, key: event::KeyEvent) {
    match key.code {
        KeyCode::Enter => {
            app.execute_command();
        }
        KeyCode::Esc => {
            app.mode = AppMode::Normal;
            app.command_input.clear();
        }
        KeyCode::Backspace => {
            app.command_input.pop();
        }
        KeyCode::Char(c) => {
            app.command_input.push(c);
        }
        _ => {}
    }
}

fn handle_search_mode(app: &mut App, key: event::KeyEvent) {
    match key.code {
        KeyCode::Enter => {
            app.execute_search();
        }
        KeyCode::Esc => {
            app.mode = AppMode::Normal;
            app.search_input.clear();
        }
        KeyCode::Backspace => {
            app.search_input.pop();
        }
        KeyCode::Char(c) => {
            app.search_input.push(c);
        }
        _ => {}
    }
}

fn handle_block_type_picker(app: &mut App, key: event::KeyEvent) {
    match key.code {
        KeyCode::Esc => {
            app.mode = AppMode::Normal;
            app.show_block_type_picker = false;
        }
        KeyCode::Char('1') => {
            app.add_block(BlockType::Text);
            app.show_block_type_picker = false;
        }
        KeyCode::Char('2') => {
            app.add_block(BlockType::Heading1);
            app.show_block_type_picker = false;
        }
        KeyCode::Char('3') => {
            app.add_block(BlockType::Heading2);
            app.show_block_type_picker = false;
        }
        KeyCode::Char('4') => {
            app.add_block(BlockType::Heading3);
            app.show_block_type_picker = false;
        }
        KeyCode::Char('5') => {
            app.add_block(BlockType::BulletList);
            app.show_block_type_picker = false;
        }
        KeyCode::Char('6') => {
            app.add_block(BlockType::NumberedList);
            app.show_block_type_picker = false;
        }
        KeyCode::Char('7') => {
            app.add_block(BlockType::Todo);
            app.show_block_type_picker = false;
        }
        KeyCode::Char('8') => {
            app.add_block(BlockType::Code);
            app.show_block_type_picker = false;
        }
        KeyCode::Char('9') => {
            app.add_block(BlockType::Quote);
            app.show_block_type_picker = false;
        }
        KeyCode::Char('0') => {
            app.add_block(BlockType::Divider);
            app.show_block_type_picker = false;
        }
        KeyCode::Char('-') => {
            app.add_block(BlockType::Callout);
            app.show_block_type_picker = false;
        }
        _ => {}
    }
}

fn handle_page_title_mode(app: &mut App, key: event::KeyEvent) {
    match key.code {
        KeyCode::Enter | KeyCode::Esc => {
            app.mode = AppMode::Normal;
        }
        KeyCode::Backspace => {
            if let Some(id) = app.current_page_id {
                let page = app.db.get_page(id).unwrap();
                let title = &page.title;
                let new_title: String = title.chars().take(title.chars().count() - 1).collect();
                app.db.update_page_title(id, new_title);
            }
        }
        KeyCode::Char(c) => {
            if let Some(id) = app.current_page_id {
                let page = app.db.get_page(id).unwrap();
                let mut title = page.title.clone();
                title.push(c);
                app.db.update_page_title(id, title);
            }
        }
        _ => {}
    }
}
