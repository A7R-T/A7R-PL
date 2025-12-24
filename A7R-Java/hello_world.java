

import java.util.Scanner;

public class hello_world {
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    System.out.print("first number: ");
    float num1 = scanner.nextInt();
    System.out.print("operator: ");
    char opr = scanner.next().charAt(0);
    System.out.print("second number: ");
    float num2 = scanner.nextInt();
    calculator(num1, num2, opr);
    scanner.close();
  }

  public static void calculator(float a, float b, char c) {
      if (c == '+') {
          System.out.println(a + b);
      } else if (c == '-') {
          System.out.println(a - b);
      } else if (c == '*') {
          System.out.println(a * b);
      } else if (c == '/') {
          System.out.println(a / b);
      } else {
      System.out.println("Wrong Operator or Number, Please try again.");
    }
    }
}
