use uuid::Uuid;
use crate::models::{Database, BlockType, Page};
use crate::storage;

#[derive(Debug, PartialEq)]
pub enum AppMode {
    Normal,
    Insert,
    Command,
    Search,
    PageTitle,
    BlockTypePicker,
}

#[derive(Debug, PartialEq)]
pub enum Focus {
    Sidebar,
    Editor,
}

pub struct App {
    pub db: Database,
    pub current_page_id: Option<Uuid>,
    pub selected_block_idx: usize,
    pub sidebar_cursor: usize,
    pub mode: AppMode,
    pub focus: Focus,
    pub command_input: String,
    pub search_input: String,
    pub search_results: Vec<Uuid>,
    pub message: Option<String>,
    pub show_block_type_picker: bool,
    pub should_quit: bool,
    pub sidebar_width: u16,
}

impl App {
    pub fn new() -> Self {
        let db = storage::load_database().unwrap_or_else(|e| {
            eprintln!("Warning: Could not load database: {}", e);
            Database::new()
        });
        let first_page_id = db.pages.first().map(|p| p.id);
        Self {
            db,
            current_page_id: first_page_id,
            selected_block_idx: 0,
            sidebar_cursor: 0,
            mode: AppMode::Normal,
            focus: Focus::Editor,
            command_input: String::new(),
            search_input: String::new(),
            search_results: Vec::new(),
            message: None,
            show_block_type_picker: false,
            should_quit: false,
            sidebar_width: 30,
        }
    }

    pub fn save(&self) {
        if let Err(e) = storage::save_database(&self.db) {
            eprintln!("Failed to save database: {}", e);
        }
    }

    pub fn current_page(&self) -> Option<&Page> {
        self.current_page_id.and_then(|id| self.db.get_page(id))
    }

    pub fn current_page_mut(&mut self) -> Option<&mut Page> {
        self.current_page_id.and_then(|id| self.db.get_page_mut(id))
    }

    pub fn set_message(&mut self, msg: &str) {
        self.message = Some(msg.to_string());
    }

    pub fn create_page(&mut self, title: &str) {
        let parent_id = self.current_page_id;
        let page = self.db.create_page(title, parent_id);
        let id = page.id;
        self.current_page_id = Some(id);
        self.selected_block_idx = 0;
        self.save();
        self.set_message(&format!("Created page: {}", title));
    }

    pub fn delete_current_page(&mut self) {
        if let Some(id) = self.current_page_id {
            let title = self.db.get_page(id).map(|p| p.title.clone()).unwrap_or_default();
            self.db.delete_page(id);
            self.current_page_id = self.db.pages.first().map(|p| p.id);
            self.selected_block_idx = 0;
            self.save();
            self.set_message(&format!("Deleted page: {}", title));
        }
    }

    pub fn add_block(&mut self, block_type: BlockType) {
        let len = if let Some(page) = self.current_page() {
            page.blocks.len()
        } else {
            0
        };
        if let Some(page) = self.current_page_mut() {
            page.add_block(block_type);
        }
        self.selected_block_idx = len;
        self.mode = AppMode::Insert;
        self.save();
    }

    pub fn delete_block(&mut self) {
        let (block_id, len) = if let Some(page) = self.current_page() {
            if page.blocks.len() > 1 {
                (Some(page.blocks[self.selected_block_idx].id), page.blocks.len())
            } else {
                (None, 0)
            }
        } else {
            (None, 0)
        };
        if let Some(block_id) = block_id {
            if let Some(page) = self.current_page_mut() {
                page.remove_block(block_id);
            }
            if self.selected_block_idx >= len - 1 {
                self.selected_block_idx = len - 2;
            }
            self.save();
        }
    }

    pub fn move_block_up(&mut self) {
        let block_id = if let Some(page) = self.current_page() {
            Some(page.blocks[self.selected_block_idx].id)
        } else {
            None
        };
        if let Some(block_id) = block_id {
            if let Some(page) = self.current_page_mut() {
                page.move_block_up(block_id);
            }
            if self.selected_block_idx > 0 {
                self.selected_block_idx -= 1;
            }
            self.save();
        }
    }

    pub fn move_block_down(&mut self) {
        let (block_id, len) = if let Some(page) = self.current_page() {
            (Some(page.blocks[self.selected_block_idx].id), page.blocks.len())
        } else {
            (None, 0)
        };
        if let Some(block_id) = block_id {
            if let Some(page) = self.current_page_mut() {
                page.move_block_down(block_id);
            }
            if self.selected_block_idx < len - 1 {
                self.selected_block_idx += 1;
            }
            self.save();
        }
    }

    pub fn toggle_todo(&mut self) {
        let block_id = if let Some(page) = self.current_page() {
            Some(page.blocks[self.selected_block_idx].id)
        } else {
            None
        };
        if let Some(block_id) = block_id {
            if let Some(page) = self.current_page_mut() {
                page.toggle_todo(block_id);
            }
            self.save();
        }
    }

    pub fn update_current_block(&mut self, content: String) {
        let block_id = if let Some(page) = self.current_page() {
            Some(page.blocks[self.selected_block_idx].id)
        } else {
            None
        };
        if let Some(block_id) = block_id {
            if let Some(page) = self.current_page_mut() {
                page.update_block(block_id, content);
            }
            self.save();
        }
    }

    pub fn navigate_sidebar_up(&mut self) {
        if self.sidebar_cursor > 0 {
            self.sidebar_cursor -= 1;
        }
    }

    pub fn navigate_sidebar_down(&mut self) {
        let root_count = self.db.get_root_pages().len();
        if self.sidebar_cursor + 1 < root_count {
            self.sidebar_cursor += 1;
        }
    }

    pub fn select_sidebar_page(&mut self) {
        let root_pages = self.db.get_root_pages();
        if let Some(page) = root_pages.get(self.sidebar_cursor) {
            self.current_page_id = Some(page.id);
            self.selected_block_idx = 0;
            self.focus = Focus::Editor;
        }
    }

    pub fn execute_command(&mut self) {
        let cmd = self.command_input.clone();
        let cmd = cmd.trim().to_string();
        self.command_input.clear();
        self.mode = AppMode::Normal;

        match cmd.as_str() {
            "q" | "quit" => self.should_quit = true,
            "w" | "write" => {
                self.save();
                self.set_message("Saved!");
            }
            "n" | "new" => {
                self.create_page("Untitled");
            }
            "d" | "delete" => {
                self.delete_current_page();
            }
            "s" | "search" => {
                self.mode = AppMode::Search;
            }
            "h" | "help" => {
                self.set_message("Commands: q(uit), n(ew), d(elete), s(earch), w(rite)");
            }
            _ => {
                if cmd.starts_with("new ") {
                    let title = cmd.trim_start_matches("new ").to_string();
                    self.create_page(&title);
                } else if cmd.starts_with("goto ") {
                    let title = cmd.trim_start_matches("goto ").to_string();
                    if let Some(page) = self.db.pages.iter().find(|p| p.title.to_lowercase() == title.to_lowercase()) {
                        let id = page.id;
                        let page_title = page.title.clone();
                        self.current_page_id = Some(id);
                        self.selected_block_idx = 0;
                        self.set_message(&format!("Navigated to: {}", page_title));
                    } else {
                        self.set_message(&format!("Page not found: {}", title));
                    }
                } else {
                    self.set_message(&format!("Unknown command: {}", cmd));
                }
            }
        }
    }

    pub fn execute_search(&mut self) {
        let query = self.search_input.clone();
        self.mode = AppMode::Normal;
        if !query.is_empty() {
            self.search_results = self.db.search_pages(&query)
                .iter()
                .map(|p| p.id)
                .collect();
            if let Some(id) = self.search_results.first() {
                self.current_page_id = Some(*id);
                self.selected_block_idx = 0;
            }
        }
        self.search_input.clear();
    }
}
