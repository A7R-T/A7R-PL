
#include <iostream>
#include <cmath>

using namespace std;

int main() {
    int num1, num2;
    char opr;
    cout << "Num1: ";
    cin >> num1;
    cout << "Operator: ";
    cin >> opr;
    cout << "Num2: ";
    cin >> num2;
    if (opr == '+') {
        cout << num1 + num2 << endl;
    }
    else if (opr == '-') {
        cout << num1 - num2 << endl;
    }
    else if (opr == '*') {
        cout << num1 * num2 << endl;
    }
    else if (opr == '/') {
        cout << num1 / num2 << endl;
    }
    else if (opr == '%') {
        cout << num1 % num2 << endl;
    }
    else if (opr == '^') {
        cout << pow(num1, num2) << endl; 
    }
    else {
        cout << "Invalid Operator" << endl;
    }
    return 0;
}