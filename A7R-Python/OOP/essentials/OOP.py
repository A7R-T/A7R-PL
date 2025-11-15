#the __init__ is used to intialize my class and I can put parameters there or not depending on my project needs
#the parameter names has nothing to do with the property names that will get assigned to them later
#self is just used to refer the the name of the object when it's created
class A7R:
    def __init__(self, the_name="Romany", the_skill="Programming", the_power="Infinite"):
        self.name = the_name
        self.skill = the_skill 
        self.power = the_power 

A7R_T = A7R("A7R")
print (A7R_T.name)
print (A7R_T.skill)
print (A7R_T.power)

