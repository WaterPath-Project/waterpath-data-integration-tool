import { useNavigate } from "react-router";
import { BasicLayout } from "../templates";
import { Button } from "../atoms/button";

export function Success() {
    const navigate = useNavigate();
    return (
        <BasicLayout>
            <Button variant="outline" className="bg-wpBlue text-wpWhite hover:bg-wpBlue/80 hover:text-white rounded-[8px] font-inter font-bold text-xs flex justify-self-start w-fit" onClick={() => navigate("/")}>Back</Button>
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <h1 className="text-4xl font-bold text-wpBlue">Success!</h1>
                <p className="mt-4 text-lg text-wpBlue">Your request completed succesfully!</p>
            </div >
        </BasicLayout >
    );
}