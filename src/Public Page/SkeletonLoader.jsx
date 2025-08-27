import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function SkeletonLoader({
    count = 1,
    height = 20,
    width = "100%",
    circle = false,
    baseColor = "#e0e0e0",
    highlightColor = "#f5f5f5",
    borderRadius = "8px",
}) {
    return (
        <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
            <Skeleton
                count={count}
                height={height}
                width={width}
                circle={circle}
                borderRadius={borderRadius}
            />
        </SkeletonTheme>
    );
}

export default SkeletonLoader;
