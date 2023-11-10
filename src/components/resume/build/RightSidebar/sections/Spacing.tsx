import Heading from "~/components/shared/Heading";
import { Check } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/common/dropdown-menu';


import { Button } from "~/components/common/button";
import { TypeCategory } from "~/schema";
import { FontType } from "~/constants";

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


type SpacingProps = {
    category: TypeCategory;
    label: string;
}

const SpacingWidgets: React.FC<SpacingProps> = ({label, category}) => {

    const onClickedItemSpacing = (category: string, pos: number) => {
        alert(category);
    }

    return (
        <>
            <div>
                <div className="flex">
                    <div className="flex-1 text-[16px]">{label}</div>
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
                                            <DropdownMenuItem onClick={() => onClickedItemSpacing(category, pos)}>
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

const Spacing = () => {
    return(
        <>
            <Heading path="metadata.layout" name="Spacing" />
            <SpacingWidgets category={FontType.SECTION} label="Section"/>
            <SpacingWidgets category={FontType.SUBTITLE} label="Subtitle"/>
            <SpacingWidgets category={FontType.NORMALTEXT} label="Normal text"/>
        </>
    )
}
export default Spacing;