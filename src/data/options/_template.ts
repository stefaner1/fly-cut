import { mappingFormItem } from '@/utils/formItemUtils';
// Element property configuration
export const Options = {
    attributes: [
        mappingFormItem('Tabs', {
            children: [
                mappingFormItem('TabPane', {
                    name: 'Display',
                    children: [
                        mappingFormItem('TabsCard', {
                            children: [
                                mappingFormItem('TabPane', {
                                    name: 'Basic',
                                    children: [
                                        mappingFormItem('Collapse', {
                                            children: [
                                                mappingFormItem('CollapsePane', {
                                                    name: 'Basic',
                                                    children: [
                                                        mappingFormItem('Slider', { attr: {
                                                                min: 1,
                                                                max: 100,
                                                                step: 1
                                                            }, name: 'Scale', mappingKey: 'scale' }),
                                                        mappingFormItem('Flex', { attr: { col: 2 }, name: 'Position', children: [
                                                                mappingFormItem('Number', { attr: {
                                                                        controlsPosition: 'right'
                                                                    }, name: 'x', mappingKey: 'position.x' }),
                                                                mappingFormItem('Number', { attr: {
                                                                        controlsPosition: 'right'
                                                                    }, name: 'y', mappingKey: 'position.y' })
                                                            ] }),
                                                        mappingFormItem('Number', { name: 'Rotation', mappingKey: 'position' }),
                                                        mappingFormItem('Color', { name: 'Background Color', mappingKey: 'color' }),
                                                        mappingFormItem('TextArea', { attr: {
                                                                autosize: {
                                                                    minRows: 1,
                                                                    maxRows: 4
                                                                },
                                                                placeholder: 'Please enter'
                                                            }, name: 'Text', mappingKey: 'color1' }),
                                                        mappingFormItem('Boolean', { name: 'switch', mappingKey: 'color2' }),
                                                        mappingFormItem('String', { attr: { placeholder: 'Please enter a number' }, name: 'string', mappingKey: 'color3' }),
                                                        mappingFormItem('Radio', { name: 'Radio', mappingKey: 'color4', defaultValue: 'o1', children: [
                                                                mappingFormItem('RadioItem', { name: 'o1', value: 'o1' }),
                                                                mappingFormItem('RadioItem', { name: 'o2', value: 'o2' })
                                                            ]
                                                        }),
                                                        mappingFormItem('RadioButton', { name: 'Radio', mappingKey: 'color5', defaultValue: 'o1', children: [
                                                                mappingFormItem('RadioButtonItem', { name: 'o1', value: 'o1' }),
                                                                mappingFormItem('RadioButtonItem', { name: 'o2', value: 'o2' })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        mappingFormItem('Collapse', {
                                            children: [
                                                mappingFormItem('CollapsePane', {
                                                    name: 'Blend',
                                                    children: [
                                                        mappingFormItem('Slider', {
                                                            name: 'Opacity',
                                                            mappingKey: 'opacity'
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                mappingFormItem('TabPane', {
                                    name: 'Background',
                                    children: [
                                        mappingFormItem('FormItem', {
                                            name: 'Opacity',
                                            dataType: 'Slider',
                                            mappingKey: 'opacity'
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                mappingFormItem('TabPane', {
                    name: 'Animation',
                    children: []
                })
            ]
        })
    ]
};
