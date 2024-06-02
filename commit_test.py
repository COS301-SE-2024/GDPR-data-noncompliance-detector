
import commit


def testThing():
    assert commit.outputSomething() == "Something"
    assert commit.outputSomething() != "idkSomething"
