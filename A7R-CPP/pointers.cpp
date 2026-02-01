#include <iostream>

using namespace std;

int main()
{
  int num1 = 7;
  int* nump = &num1;
  cout << "This is a Pointer: " << nump << endl;
  cout << "And this is the value in it: " << num1 << endl;
  return 0;
}
