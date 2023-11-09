import Heading from "~/components/shared/Heading";
import { Check } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/components/common/dropdown-menu';

import toast from "react-hot-toast";
import { useState } from "react";
import { SectionType } from "~/schema";
import { Button } from "~/components/common/button";

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
        switch (type) {
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
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button onClick={onClickedBtnSectionSpacing} variant="ghost" size="icon">
                                    <img src='/icon/spacing-list.svg' alt="line" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent anchorEl={anchorSpacingSec} onClose={handleClose} open={Boolean(anchorSpacingSec)}>
                                {
                                    spacings.map((space, pos) => {
                                        return (
                                            <DropdownMenuItem onClick={() => onClickedItemSpacing(SpacingType.SECTION, pos)}>
                                                <Check size="14" /> &nbsp; {space.name}
                                            </DropdownMenuItem>
                                        );
                                    })
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex">
                    <div className="grow text-[16px]">Subtitle</div>
                    <div className="flex-none">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button onClick={onClickedBtnSectionSpacing} variant="ghost" size="icon">
                                    <img src='/icon/spacing-list.svg' alt="line" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent anchorEl={anchorSpacingSec} onClose={handleClose} open={Boolean(anchorSpacingSec)}>
                                {
                                    spacings.map((space, pos) => {
                                        return (
                                            <DropdownMenuItem onClick={() => onClickedItemSpacing(SpacingType.SUB_TITLE, pos)}>
                                                <Check size="14" /> &nbsp; {space.name}
                                            </DropdownMenuItem>
                                        );
                                    })
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                </div>

                <div className="flex">
                    <div className="grow text-[16px]">Normal Text</div>
                    <div className="flex-none">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button onClick={onClickedBtnSectionSpacing} variant="ghost" size="icon">
                                    <img src='/icon/spacing-list.svg' alt="line" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent anchorEl={anchorSpacingSec} onClose={handleClose} open={Boolean(anchorSpacingSec)}>
                                {
                                    spacings.map((space, pos) => {
                                        return (
                                            <DropdownMenuItem onClick={() => onClickedItemSpacing(SpacingType.NORMAL_TEXT, pos)}>
                                                <Check size="14" /> &nbsp; {space.name}
                                            </DropdownMenuItem>
                                        );
                                    })
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

            </div>
        </>
    )
}
export default Spacing;