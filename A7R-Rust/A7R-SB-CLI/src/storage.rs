use std::fs;
use std::path::PathBuf;
use anyhow::{Result, Context};
use crate::models::Database;

pub fn get_data_dir() -> PathBuf {
    let mut path = dirs::data_local_dir().unwrap_or_else(|| PathBuf::from("."));
    path.push("notion-tui");
    path
}

pub fn get_db_path() -> PathBuf {
    let mut path = get_data_dir();
    path.push("database.json");
    path
}

pub fn load_database() -> Result<Database> {
    let path = get_db_path();
    if !path.exists() {
        return Ok(Database::new());
    }
    let data = fs::read_to_string(&path)
        .with_context(|| format!("Failed to read database at {}", path.display()))?;
    let db: Database = serde_json::from_str(&data)
        .with_context(|| "Failed to parse database JSON")?;
    Ok(db)
}

pub fn save_database(db: &Database) -> Result<()> {
    let path = get_db_path();
    let dir = path.parent().unwrap();
    fs::create_dir_all(dir)
        .with_context(|| format!("Failed to create data directory at {}", dir.display()))?;
    let data = serde_json::to_string_pretty(db)
        .with_context(|| "Failed to serialize database")?;
    fs::write(&path, data)
        .with_context(|| format!("Failed to write database at {}", path.display()))?;
    Ok(())
}
