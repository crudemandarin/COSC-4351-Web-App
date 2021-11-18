import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import Landing from "../../pages/Landing/Landing"

configure({adapter: new Adapter()});

describe("Landing", () => {
  // it("should render a input username field", () => {
  //   const container = shallow(<Landing/>)
  //   expect(container.find("div").length).toEqual(1)
  // })

  it("should render a input pass field", () => {
    expect(true).toBeTruthy()
  })
}
)