import Heading from "~/components/shared/Heading";
import { Check } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/common/dropdown-menu';


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
                                <Button  variant="ghost" size="icon">
                                    <img src='/icon/spacing-list.svg' alt="line" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
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
                                <Button variant="ghost" size="icon">
                                    <img src='/icon/spacing-list.svg' alt="line" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
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
                                <Button  variant="ghost" size="icon">
                                    <img src='/icon/spacing-list.svg' alt="line" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
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