import { constants, stylesheet } from "@vendetta/metro/common";
import { semanticColors } from "@vendetta/ui";
import { ReactNative } from "@vendetta/metro/common";

export interface CodeblockProps {
    selectable?: boolean;
    style?: ReactNative.TextStyle;
    children?: string;
}

const useStyles = stylesheet.createThemedStyleSheet({
    codeBlock: {
        fontFamily: constants.Fonts.CODE_NORMAL,
        fontSize: 12,
        textAlignVertical: "center",
        backgroundColor: semanticColors.BACKGROUND_SECONDARY,
        color: semanticColors.TEXT_NORMAL,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: semanticColors.BACKGROUND_TERTIARY,
        padding: 10,
    },
});

// iOS doesn't support the selectable property on RN.Text...
const InputBasedCodeblock = ({ style, children }: CodeblockProps) => <ReactNative.TextInput editable={false} multiline style={[useStyles().codeBlock, style && style]} value={children} />;
const TextBasedCodeblock = ({ selectable, style, children }: CodeblockProps) => <ReactNative.Text selectable={selectable} style={[useStyles().codeBlock, style && style]}>{children}</ReactNative.Text>;

export default function Codeblock({ selectable, style, children }: CodeblockProps) {
    if (!selectable) return <TextBasedCodeblock style={style} children={children} />;
    return <InputBasedCodeblock style={style} children={children} />;
}
