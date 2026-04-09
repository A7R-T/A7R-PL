use std::io;

fn main() {
    let mut num1 = String::new();
    let mut num2 = String::new();
    let mut opr = String::new();

    println!("Num1: ");
    io::stdin().read_line(&mut num1);
    println!("Opr: ");
    io::stdin().read_line(&mut opr);
    println!("Num2: ");
    io::stdin().read_line(&mut num2);
    println!("The Result is: ");
    match opr.to_string().trim() {
        "+" => println!("{}", num1.trim().parse::<i32>().unwrap() + num2.trim().parse::<i32>().unwrap()),
        "-" => println!("{}", num1.trim().parse::<i32>().unwrap() - num2.trim().parse::<i32>().unwrap()),
        "*" => println!("{}", num1.trim().parse::<i32>().unwrap() * num2.trim().parse::<i32>().unwrap()),
        "/" => println!("{}", num1.trim().parse::<i32>().unwrap() / num2.trim().parse::<i32>().unwrap()),
        "^" => println!("{}", num1.trim().parse::<i32>().unwrap().pow(num2.trim().parse::<u32>().unwrap())),
        "%" => println!("{}", num1.trim().parse::<i32>().unwrap() % num2.trim().parse::<i32>().unwrap()),
        &_ => println!("Invalid operator"),
    }
}
