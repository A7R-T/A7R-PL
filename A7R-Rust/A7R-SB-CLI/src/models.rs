use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum BlockType {
    Text,
    Heading1,
    Heading2,
    Heading3,
    BulletList,
    NumberedList,
    Todo,
    Code,
    Quote,
    Divider,
    Callout,
}

impl BlockType {
    pub fn icon(&self) -> &str {
        match self {
            BlockType::Text => " ",
            BlockType::Heading1 => "H1",
            BlockType::Heading2 => "H2",
            BlockType::Heading3 => "H3",
            BlockType::BulletList => "•",
            BlockType::NumberedList => "1.",
            BlockType::Todo => "☐",
            BlockType::Code => "<>",
            BlockType::Quote => ">",
            BlockType::Divider => "─",
            BlockType::Callout => "!",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Block {
    pub id: Uuid,
    pub block_type: BlockType,
    pub content: String,
    pub checked: bool,
    pub language: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Block {
    pub fn new(block_type: BlockType) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4(),
            block_type,
            content: String::new(),
            checked: false,
            language: String::from("text"),
            created_at: now,
            updated_at: now,
        }
    }

    #[allow(dead_code)]
    pub fn display_text(&self) -> String {
        match self.block_type {
            BlockType::Todo => {
                let checkbox = if self.checked { "[x]" } else { "[ ]" };
                format!("{} {}", checkbox, self.content)
            }
            BlockType::BulletList => format!("• {}", self.content),
            BlockType::NumberedList => format!("1. {}", self.content),
            BlockType::Code => format!("```{}\n{}\n```", self.language, self.content),
            BlockType::Quote => format!("│ {}", self.content),
            BlockType::Divider => String::from("────────────────────"),
            BlockType::Callout => format!("💡 {}", self.content),
            _ => self.content.clone(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Page {
    pub id: Uuid,
    pub title: String,
    pub icon: String,
    pub parent_id: Option<Uuid>,
    pub children: Vec<Uuid>,
    pub blocks: Vec<Block>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Page {
    pub fn new(title: &str, parent_id: Option<Uuid>) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4(),
            title: title.to_string(),
            icon: String::from("📄"),
            parent_id,
            children: Vec::new(),
            blocks: vec![Block::new(BlockType::Text)],
            created_at: now,
            updated_at: now,
        }
    }

    pub fn add_block(&mut self, block_type: BlockType) -> &Block {
        let block = Block::new(block_type);
        self.blocks.push(block);
        self.updated_at = Utc::now();
        self.blocks.last().unwrap()
    }

    pub fn remove_block(&mut self, block_id: Uuid) {
        self.blocks.retain(|b| b.id != block_id);
        if self.blocks.is_empty() {
            self.blocks.push(Block::new(BlockType::Text));
        }
        self.updated_at = Utc::now();
    }

    pub fn update_block(&mut self, block_id: Uuid, content: String) {
        if let Some(block) = self.blocks.iter_mut().find(|b| b.id == block_id) {
            block.content = content;
            block.updated_at = Utc::now();
            self.updated_at = Utc::now();
        }
    }

    pub fn toggle_todo(&mut self, block_id: Uuid) {
        if let Some(block) = self.blocks.iter_mut().find(|b| b.id == block_id) {
            if block.block_type == BlockType::Todo {
                block.checked = !block.checked;
                block.updated_at = Utc::now();
            }
        }
    }

    pub fn move_block_up(&mut self, block_id: Uuid) {
        let idx = self.blocks.iter().position(|b| b.id == block_id);
        if let Some(idx) = idx {
            if idx > 0 {
                self.blocks.swap(idx, idx - 1);
                self.updated_at = Utc::now();
            }
        }
    }

    pub fn move_block_down(&mut self, block_id: Uuid) {
        let idx = self.blocks.iter().position(|b| b.id == block_id);
        if let Some(idx) = idx {
            if idx < self.blocks.len() - 1 {
                self.blocks.swap(idx, idx + 1);
                self.updated_at = Utc::now();
            }
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Database {
    pub pages: Vec<Page>,
}

impl Database {
    pub fn new() -> Self {
        Self { pages: Vec::new() }
    }

    pub fn create_page(&mut self, title: &str, parent_id: Option<Uuid>) -> &Page {
        let page = Page::new(title, parent_id);
        let id = page.id;
        self.pages.push(page);
        if let Some(pid) = parent_id {
            if let Some(parent) = self.pages.iter_mut().find(|p| p.id == pid) {
                parent.children.push(id);
            }
        }
        self.pages.last().unwrap()
    }

    pub fn get_page(&self, id: Uuid) -> Option<&Page> {
        self.pages.iter().find(|p| p.id == id)
    }

    pub fn get_page_mut(&mut self, id: Uuid) -> Option<&mut Page> {
        self.pages.iter_mut().find(|p| p.id == id)
    }

    pub fn delete_page(&mut self, id: Uuid) {
        if let Some(page) = self.pages.iter().find(|p| p.id == id) {
            let parent_id = page.parent_id;
            let children: Vec<Uuid> = page.children.clone();
            if let Some(pid) = parent_id {
                if let Some(parent) = self.pages.iter_mut().find(|p| p.id == pid) {
                    parent.children.retain(|c| c != &id);
                }
            }
            for child_id in children {
                self.delete_page(child_id);
            }
        }
        self.pages.retain(|p| p.id != id);
    }

    pub fn get_root_pages(&self) -> Vec<&Page> {
        self.pages.iter().filter(|p| p.parent_id.is_none()).collect()
    }

    pub fn search_pages(&self, query: &str) -> Vec<&Page> {
        let query_lower = query.to_lowercase();
        self.pages.iter()
            .filter(|p| {
                p.title.to_lowercase().contains(&query_lower) ||
                p.blocks.iter().any(|b| b.content.to_lowercase().contains(&query_lower))
            })
            .collect()
    }

    pub fn update_page_title(&mut self, id: Uuid, title: String) {
        if let Some(page) = self.pages.iter_mut().find(|p| p.id == id) {
            page.title = title;
            page.updated_at = Utc::now();
        }
    }
}
