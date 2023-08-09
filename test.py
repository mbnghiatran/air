def default_method_decorator(default_method):
    def decorator(method):
        def wrapped(self, *args, **kwargs):
            default_method(self)
            return method(self, *args, **kwargs)
        return wrapped
    return decorator

class MyClass:
    def __init__(self, value):
        self.value = value

    def default_method(self):
        print("Default method called")

    @default_method_decorator(default_method)
    def some_method(self):
        print(f"Some method called with value: {self.value}")

obj = MyClass(42)
obj.some_method()