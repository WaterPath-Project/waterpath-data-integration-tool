import { BasicLayout } from "../templates";
import React from "react";

export function NotFound(): React.JSX.Element {
    return (
        <BasicLayout>
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <h1 className="text-4xl font-bold text-wpBlue">404 - Not Found</h1>
                <p className="mt-4 text-lg text-wpBlue">The page you are looking for does not exist.</p>
            </div >
        </BasicLayout >
    );
}