import "dart:io";

void main() {
  print("==========================");
  print("==========================");
  print("==========================");
  stdout.write('number1: ');
  String? input1 = stdin.readLineSync();
  print("==========================");
  stdout.write('operator: ');
  String? opr = stdin.readLineSync();
  print("==========================");
  stdout.write('number2: ');
  String? input3 = stdin.readLineSync();
  print("==========================");

  int Num1 = int.tryParse(input1 ?? '') ?? 0;
  int Num2 = int.tryParse(input3 ?? '') ?? 0;

  switch(opr) {
  case ('+'):
    stdout.write('The Result is: ');
    print(Num1 + Num2);
    break;
  case ('-'):
    print(Num1 - Num2);
    break;
  case ('*'):
    print(Num1 * Num2);
    break;
  case ('/'):
    print(Num1 / Num2);
    break;
  case ('%'):
    print(Num1 % Num2);
    break;
  default:
    print('Invalid Operation try again later');
  }
}
