import example

def test_hello():
    assert example.hello() == "hello"

def test_hello_false():
    assert example.hello() != "fake"