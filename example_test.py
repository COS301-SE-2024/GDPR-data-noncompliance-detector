import example

def test_hello():
    assert example.hello() == "hello"

def test_hello_false():
    assert example.hello() != "fake"

def test_one():
    assert example.one() > 0