// in the C language we can't just print variables like we do in other languages
// we need to use something called format specifiers
// we add the "%" followed by the correct format specifier for our variable
// depending on our variable's type so for example if we have a variable called
// myNum and it's type is an int then it's format specifier is "%d" int = "%d",
// float = "%f", character = "%c"
// you have to put in mind that order matters, the order in which you put your format specifiers has to be the same order you put your variables
// if you just put your variables you will get in error ;)

#include <stdio.h>

int main() {
  int myNum = 7;
  double myFloat = 7.37;
  char myChar = 'R';
  printf("%d\n%f\n%c\n", myNum, myFloat, myChar);
  printf("Hello World Again");
  return 0;
}
