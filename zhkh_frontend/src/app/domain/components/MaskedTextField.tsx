import { IMaskInput } from 'react-imask';
import React from 'react';

export const MaskedInput = React.forwardRef<HTMLInputElement, any>(
    function MaskedInput(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                inputRef={ref}
                mask={props.mask}
                overwrite
                onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
            />
        );
    }
);
