import { mount, shallowMount } from "@vue/test-utils";
import DraggableNumberInput from "@/components/DraggableNumberInput.vue";

const wrapperDefaultsOpts = {
  propsData: { label: "My input", value: 0 },
};

function createWrapperWithParent(opts?: any) {
  const defaultComponentOptions = {
    components: { "draggable-number-input": DraggableNumberInput},
    data() { return { value: 0 }; },
    template: `
      <div>
        <draggable-number-input v-model='value' label='Test label'/>
      </div>
    `,
  };
  const parentWrapper = mount(
    { ...defaultComponentOptions, ...opts },
    { attachToDocument: true },
  );

  return {
    child: parentWrapper.find(DraggableNumberInput),
    parent: parentWrapper,
  };
}

describe("DraggableNumberInput.vue", () => {
  it("can be updated like a normal input", () => {
    const wrappers = createWrapperWithParent(),
          wrapper = wrappers.child;

    wrapper.find("input").setValue(200);

    expect( wrapper.emitted().input[0][0] ).toBe(200);

    expect( wrappers.parent.vm.$data.value ).toBe(200);
    expect( wrapper.props("value") ).toBe(200);
  });

  it("correctly creates and connects the input label", () => {
    const wrapper = shallowMount(
      DraggableNumberInput,
      wrapperDefaultsOpts,
    );

    expect( wrapper.find("input").attributes("name") )
      .toBe("draggable-number-my-input");
  });

  it(
    `increments its value when dragging up on Y axis,
    and decrements on dragging down`,
    () => {
      const wrappers = createWrapperWithParent(),
            wrapper = wrappers.child;

      wrapper.find("label")
        .trigger("mousedown");

      expect(wrapper.vm.$data.isDragging).toBeTruthy();

      wrapper.trigger("mousemove", { movementY: -200 });

      expect( wrapper.emitted().input[0][0] ).toBe(200);

      expect( wrappers.parent.vm.$data.value ).toBe(200);
      expect( wrapper.props("value") ).toBe(200);

      wrapper.trigger("mousemove", { movementY: 150 });

      expect( wrappers.parent.vm.$data.value ).toBe(50);
      expect( wrapper.props("value") ).toBe(50);
  });

  it(
    `increments its value when dragging right on X axis,
    and decrements on dragging left, when \`dragDirection\` is set to \`X\``,
    () => {
      const wrappers = createWrapperWithParent(),
            wrapper = wrappers.child;

      wrapper.setProps({ dragDirection: "X" });
      wrapper.find("label")
        .trigger("mousedown");

      expect(wrapper.vm.$data.isDragging).toBeTruthy();

      wrapper.trigger("mousemove", { movementX: -200 });

      expect( wrapper.emitted().input[0][0] ).toBe(-200);

      expect( wrappers.parent.vm.$data.value ).toBe(-200);
      expect( wrapper.props("value") ).toBe(-200);

      wrapper.trigger("mousemove", { movementX: 150 });

      expect( wrappers.parent.vm.$data.value ).toBe(-50);
      expect( wrapper.props("value") ).toBe(-50);
  });

  it("respects min and max boundaries", () => {
    const min = -10,
          max = 100,
          wrappers = createWrapperWithParent({
            template: `
              <div>
                <draggable-number-input
                  v-model='value'
                  label='Test label'
                  :min=${min}
                  :max=${max} />
              </div>
            `,
          }),
          wrapper = wrappers.child;

    wrapper.setProps({ min, max });

    wrapper.find("label")
      .trigger("mousedown");

    wrapper.trigger("mousemove", { movementY: -200 });

    expect( wrappers.parent.vm.$data.value ).toBe(max);
    expect( wrapper.props("value") ).toBe(max);

    wrapper.trigger("mousemove", { movementY: 350 });

    expect( wrappers.parent.vm.$data.value ).toBe(min);
    expect( wrapper.props("value") ).toBe(min);
  });

  it(
    `stops to update the element when not dragging anymore`,
    () => {
      const wrappers = createWrapperWithParent(),
            wrapper = wrappers.child;

      wrapper.find("label")
        .trigger("mousedown");

      wrapper.trigger("mousemove", { movementY: -200 });
      wrapper.trigger("mouseup");

      wrapper.trigger("mousemove", { movementY: 150 });

      expect( wrappers.parent.vm.$data.value ).toBe(200);
      expect( wrapper.props("value") ).toBe(200);
  });
});
