#the __init__ is used to intialize my class and I can put parameters there or not depending on my project needs
#the parameter names has nothing to do with the property names that will get assigned to them later
#self is just used to refer the the name of the object when it's created
#any method/function (anything that required parentheses) should have self as the first parameter ALWAYS in any class
#self doesn't have to be named 'self' it can be named anything as long as it's the first parameter as we said
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age 

    def greet(self):
        print("hello " + self.name)
#here in the A7R class I used 'a7r' instead of 'self' so I can actually test the fact that u can use anything instead of self
class A7R:
    def __init__(a7r, the_name="Romany", the_skill="Programming", the_power="Infinite"):
        a7r.name = the_name
        a7r.skill = the_skill 
        a7r.power = the_power 

    def greet(a7r):
        print("Hello you almighty " + a7r.name)

Romany = Person("Romany", 20)
print(Romany.name)
print(Romany.age)
Romany.greet()

A7R_T = A7R("A7R")
print (A7R_T.name)
print (A7R_T.skill)
print (A7R_T.power)

A7R_T.greet()
