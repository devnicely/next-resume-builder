import Heading from "~/components/shared/Heading";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { FormatLineSpacing, OpenInNew } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useState } from "react";
import { SectionType } from "~/schema";

type Spacing = {
    name: string;
    value: number;
};


const spacings: Spacing[] = [
    { name: "Single", value: 1 },
    { name: "1.15", value: 1.15 },
    { name: "1.5", value: 1.5 },
    { name: "Double", value: 2 },
];

enum SpacingType {
    SECTION = "section",
    SUB_TITLE = "sub_title",
    NORMAL_TEXT = "normal_text"
}

const Spacing = () => {

    const [anchorSpacingSec, setAnchorSpacingSec] = useState<Element | null>(null);
    const [anchorSpacingSub, setAnchorSpacingSub] = useState<Element | null>(null);
    const [anchorSpacingText, setAnchorSpacingText] = useState<Element | null>(null);

    const handleClose = () => {
        setAnchorSpacingSec(null);
        setAnchorSpacingSub(null);
        setAnchorSpacingText(null);
    };

    const onClickedBtnSectionSpacing = (event: React.MouseEvent<Element>) => {
        setAnchorSpacingSec(event.currentTarget);
    };

    const onClickedBtnSubtitleSpacing = (event: React.MouseEvent<Element>) => {
        setAnchorSpacingSub(event.currentTarget);
    };

    const onClickedBtnNormalTextSpacing = (event: React.MouseEvent<Element>) => {
        setAnchorSpacingText(event.currentTarget);
    };

    const onClickedItemSpacing = (type: SpacingType, pos: number) => {
        switch(type){
            case SpacingType.SECTION:
                alert(SpacingType.SECTION);
                break;
            case SpacingType.SUB_TITLE:
                alert(SpacingType.SUB_TITLE);
                break;
            case SpacingType.NORMAL_TEXT:
                alert(SpacingType.NORMAL_TEXT);
                break;
        }
        handleClose();
    }

    return (
        <>
            <Heading path="metadata.layout" name="Spacing" />
            <div>
                <div className="flex">
                    <div className="grow text-[16px]">Section</div>
                    <div className="flex-none">
                        <IconButton onClick={onClickedBtnSectionSpacing}>
                            <FormatLineSpacing />
                        </IconButton>
                        <Menu anchorEl={anchorSpacingSec} onClose={handleClose} open={Boolean(anchorSpacingSec)}>
                            {
                                spacings.map((space, pos) => (
                                    <MenuItem onClick={() => onClickedItemSpacing(SpacingType.SECTION, pos)}>
                                        <ListItemIcon>
                                            {/* <OpenInNew className="scale-90" /> */}
                                        </ListItemIcon>
                                        <ListItemText>{space.name}</ListItemText>
                                    </MenuItem>
                                ))
                            }
                        </Menu>
                    </div>
                </div>

                <div className="flex">
                    <div className="grow text-[16px]">Subtitle</div>
                    <div className="flex-none">
                        <IconButton onClick={onClickedBtnSubtitleSpacing}>
                            <FormatLineSpacing />
                        </IconButton>
                        <Menu anchorEl={anchorSpacingSub} onClose={handleClose} open={Boolean(anchorSpacingSub)}>
                            {
                                spacings.map((space, pos) => (
                                    <MenuItem onClick={() => onClickedItemSpacing(SpacingType.SUB_TITLE, pos)}>
                                        <ListItemIcon>
                                            {/* <OpenInNew className="scale-90" /> */}
                                        </ListItemIcon>
                                        <ListItemText>{space.name}</ListItemText>
                                    </MenuItem>
                                ))
                            }
                        </Menu>
                    </div>
                </div>

                <div className="flex">
                    <div className="grow text-[16px]">Normal Text</div>
                    <div className="flex-none">
                        <IconButton onClick={onClickedBtnNormalTextSpacing}>
                            <FormatLineSpacing />
                        </IconButton>
                        <Menu anchorEl={anchorSpacingText} onClose={handleClose} open={Boolean(anchorSpacingText)}>
                            {
                                spacings.map((space, pos) => (
                                    <MenuItem onClick={() => onClickedItemSpacing(SpacingType.NORMAL_TEXT, pos)}>
                                        <ListItemIcon>
                                            {/* <OpenInNew className="scale-90" /> */}
                                        </ListItemIcon>
                                        <ListItemText>{space.name}</ListItemText>
                                    </MenuItem>
                                ))
                            }
                        </Menu>
                    </div>
                </div>

            </div>
        </>
    )
}
export default Spacing;