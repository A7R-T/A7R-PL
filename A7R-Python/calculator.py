num1 = int(input("number: "))
operator = input("operator: ")
num2 = int(input("number: "))


print("The Result is: ")


if operator == "+":
    print(num1 + num2)
elif operator == "-":
    print(num1 - num2)
elif operator == "*":
    print(num1 * num2)
elif operator == "/":
    print(num1 / num2)
elif operator == "**":
    print(num1 ** num2)
else:
    print("unsupported operator")
