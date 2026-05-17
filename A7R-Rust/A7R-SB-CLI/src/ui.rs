use ratatui::{
    Frame,
    layout::{Constraint, Direction, Layout, Rect},
    style::{Color, Modifier, Style},
    text::{Line, Span, Text},
    widgets::{Block, Borders, Clear, List, ListItem, Paragraph, Wrap},
};
use crate::app::{App, AppMode, Focus};
use crate::models::BlockType;

pub fn render(frame: &mut Frame, app: &mut App) {
    let chunks = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([
            Constraint::Length(app.sidebar_width),
            Constraint::Min(10),
        ])
        .split(frame.area());

    render_sidebar(frame, app, chunks[0]);
    render_editor(frame, app, chunks[1]);
    render_statusbar(frame, app, frame.area());

    match app.mode {
        AppMode::Command => render_command_bar(frame, app),
        AppMode::Search => render_search_bar(frame, app),
        AppMode::BlockTypePicker => render_block_type_picker(frame, app),
        _ => {}
    }
}

fn render_sidebar(frame: &mut Frame, app: &App, area: Rect) {
    let sidebar_style = if app.focus == Focus::Sidebar {
        Style::default().fg(Color::Cyan)
    } else {
        Style::default().fg(Color::Gray)
    };

    let root_pages = app.db.get_root_pages();
    let items: Vec<ListItem> = root_pages
        .iter()
        .enumerate()
        .map(|(i, page)| {
            let is_selected = app.current_page_id == Some(page.id);
            let is_cursor = i == app.sidebar_cursor;
            let prefix = if is_cursor { "▸ " } else { "  " };
            let icon = if page.icon.is_empty() { "📄" } else { &page.icon };
            let style = if is_selected {
                Style::default()
                    .fg(Color::Yellow)
                    .add_modifier(Modifier::BOLD)
            } else {
                sidebar_style
            };
            let content = format!("{}{} {}", prefix, icon, page.title);
            ListItem::new(content).style(style)
        })
        .collect();

    let list = List::new(items)
        .block(
            Block::default()
                .borders(Borders::ALL)
                .title(" Pages ")
                .style(sidebar_style),
        );

    frame.render_widget(list, area);
}

fn render_editor(frame: &mut Frame, app: &App, area: Rect) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Length(3),
            Constraint::Min(1),
        ])
        .split(area);

    if let Some(page) = app.current_page() {
        let title_style = if app.mode == AppMode::PageTitle {
            Style::default().fg(Color::Yellow).add_modifier(Modifier::BOLD)
        } else {
            Style::default().fg(Color::White).add_modifier(Modifier::BOLD)
        };

        let title = Paragraph::new(format!("{}  {}", page.icon, page.title))
            .style(title_style)
            .block(Block::default().borders(Borders::BOTTOM));
        frame.render_widget(title, chunks[0]);

        let block_items: Vec<Line> = page
            .blocks
            .iter()
            .enumerate()
            .flat_map(|(i, block)| {
                let is_selected = i == app.selected_block_idx;
                let is_insert = is_selected && app.mode == AppMode::Insert;

                let mut lines = Vec::new();

                let type_indicator = match block.block_type {
                    BlockType::Heading1 => Span::styled("H1 ", Style::default().fg(Color::Red).add_modifier(Modifier::BOLD)),
                    BlockType::Heading2 => Span::styled("H2 ", Style::default().fg(Color::Red)),
                    BlockType::Heading3 => Span::styled("H3 ", Style::default().fg(Color::Magenta)),
                    BlockType::BulletList => Span::styled("• ", Style::default().fg(Color::Green)),
                    BlockType::NumberedList => Span::styled("1. ", Style::default().fg(Color::Green)),
                    BlockType::Todo => {
                        let checkbox = if block.checked { "[✓] " } else { "[ ] " };
                        Span::styled(checkbox, Style::default().fg(Color::Yellow))
                    }
                    BlockType::Code => Span::styled(format!("{} ", block.language), Style::default().fg(Color::Cyan)),
                    BlockType::Quote => Span::styled("│ ", Style::default().fg(Color::Gray)),
                    BlockType::Callout => Span::styled("💡 ", Style::default()),
                    _ => Span::raw(""),
                };

                let cursor = if is_insert { "▌" } else { " " };
                let line_prefix = if is_selected {
                    Span::styled("▶", Style::default().fg(Color::Cyan))
                } else {
                    Span::raw(" ")
                };

                let content_style = if is_insert {
                    Style::default().fg(Color::White)
                } else if is_selected {
                    Style::default().fg(Color::Gray)
                } else {
                    Style::default().fg(Color::DarkGray)
                };

                let content = if block.block_type == BlockType::Divider {
                    Span::styled("────────────────────────────────────────", Style::default().fg(Color::DarkGray))
                } else {
                    Span::styled(
                        if block.content.is_empty() && is_insert { "Type here..." } else { &block.content },
                        content_style,
                    )
                };

                lines.push(Line::from(vec![
                    line_prefix,
                    Span::raw(" "),
                    type_indicator,
                    content,
                    Span::styled(cursor, Style::default().fg(Color::Cyan)),
                ]));

                lines
            })
            .collect();

        let text = Text::from(block_items);
        let editor = Paragraph::new(text)
            .wrap(Wrap { trim: false })
            .block(Block::default());
        frame.render_widget(editor, chunks[1]);
    } else {
        let welcome = Paragraph::new(Text::from(vec![
            Line::from(""),
            Line::from(Span::styled(
                "  Welcome to Notion-TUI",
                Style::default().fg(Color::Cyan).add_modifier(Modifier::BOLD),
            )),
            Line::from(""),
            Line::from(Span::styled(
                "  Press ':' for commands",
                Style::default().fg(Color::Gray),
            )),
            Line::from(Span::styled(
                "  Press 'n' to create a page",
                Style::default().fg(Color::Gray),
            )),
            Line::from(Span::styled(
                "  Press '?' for help",
                Style::default().fg(Color::Gray),
            )),
        ]))
        .block(Block::default());
        frame.render_widget(welcome, area);
    }
}

fn render_statusbar(frame: &mut Frame, app: &App, area: Rect) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Min(1),
            Constraint::Length(1),
        ])
        .split(area);

    let mode_text = match app.mode {
        AppMode::Normal => "NORMAL",
        AppMode::Insert => "INSERT",
        AppMode::Command => "COMMAND",
        AppMode::Search => "SEARCH",
        AppMode::PageTitle => "TITLE",
        AppMode::BlockTypePicker => "BLOCKS",
    };

    let mode_color = match app.mode {
        AppMode::Normal => Color::Green,
        AppMode::Insert => Color::Cyan,
        AppMode::Command => Color::Yellow,
        AppMode::Search => Color::Magenta,
        AppMode::PageTitle => Color::Yellow,
        AppMode::BlockTypePicker => Color::Blue,
    };

    let page_info = app.current_page()
        .map(|p| format!("{} | {} blocks", p.title, p.blocks.len()))
        .unwrap_or_else(|| "No page selected".to_string());

    let message = app.message.as_deref().unwrap_or("");

    let status = Paragraph::new(Line::from(vec![
        Span::styled(
            format!(" {} ", mode_text),
            Style::default().fg(Color::Black).bg(mode_color).add_modifier(Modifier::BOLD),
        ),
        Span::raw("  "),
        Span::styled(page_info, Style::default().fg(Color::White)),
        Span::raw("  "),
        Span::styled(message, Style::default().fg(Color::Yellow)),
    ]))
    .style(Style::default().bg(Color::Reset));

    frame.render_widget(status, chunks[1]);
}

fn render_command_bar(frame: &mut Frame, app: &App) {
    let area = frame.area();
    let bar_area = Rect {
        x: 0,
        y: area.height - 2,
        width: area.width,
        height: 1,
    };

    let input = Paragraph::new(format!(":{}", app.command_input))
        .style(Style::default().fg(Color::Yellow));
    frame.render_widget(Clear, bar_area);
    frame.render_widget(input, bar_area);
}

fn render_search_bar(frame: &mut Frame, app: &App) {
    let area = frame.area();
    let bar_area = Rect {
        x: 0,
        y: area.height - 2,
        width: area.width,
        height: 1,
    };

    let input = Paragraph::new(format!("/{}", app.search_input))
        .style(Style::default().fg(Color::Magenta));
    frame.render_widget(Clear, bar_area);
    frame.render_widget(input, bar_area);
}

fn render_block_type_picker(frame: &mut Frame, _app: &App) {
    let area = frame.area();
    let picker_area = Rect {
        x: area.width / 2 - 15,
        y: area.height / 2 - 6,
        width: 30,
        height: 12,
    };

    let block_types = [
        (BlockType::Text, "Text", "Plain text"),
        (BlockType::Heading1, "Heading 1", "Large heading"),
        (BlockType::Heading2, "Heading 2", "Medium heading"),
        (BlockType::Heading3, "Heading 3", "Small heading"),
        (BlockType::BulletList, "Bullet List", "Bulleted list item"),
        (BlockType::NumberedList, "Numbered List", "Numbered list item"),
        (BlockType::Todo, "To-do", "Checkbox item"),
        (BlockType::Code, "Code", "Code block"),
        (BlockType::Quote, "Quote", "Quoted text"),
        (BlockType::Divider, "Divider", "Horizontal rule"),
        (BlockType::Callout, "Callout", "Highlighted text"),
    ];

    let items: Vec<ListItem> = block_types
        .iter()
        .map(|(bt, name, desc)| {
            let content = format!("{} {} - {}", bt.icon(), name, desc);
            ListItem::new(content)
        })
        .collect();

    let list = List::new(items)
        .block(
            Block::default()
                .borders(Borders::ALL)
                .title(" Block Type "),
        );

    frame.render_widget(Clear, picker_area);
    frame.render_widget(list, picker_area);
}
