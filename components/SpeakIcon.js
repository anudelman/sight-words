import * as React from "react"
import Svg, { Path, G, Defs, ClipPath } from "react-native-svg"
const SpeakIcon = ({size=80,...props}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    {...props}
  >
    <Path
      // fill="#D9F99D"
      d="M40.268 79.816c21.846 0 39.923-18.077 39.923-39.893C80.191 18.077 62.083 0 40.237 0 18.422 0 .375 18.077.375 39.923c0 21.816 18.077 39.893 39.893 39.893Z"
    />
    <G fill="#65A30D" clipPath="url(#a)">
      <Path d="M58.16 59.811c.571.41 1.349.25 1.789-.396 3.241-4.825 5.339-10.721 5.339-17.571 0-6.864-2.142-12.746-5.34-17.586-.44-.66-1.217-.806-1.789-.396-.601.41-.689 1.188-.234 1.848 2.918 4.43 4.884 9.798 4.884 16.134 0 6.322-1.966 11.704-4.884 16.12-.455.66-.367 1.437.234 1.847ZM51.294 54.78c.602.411 1.35.279 1.775-.337 2.435-3.285 3.887-7.906 3.887-12.599 0-4.708-1.437-9.358-3.887-12.6-.425-.615-1.173-.762-1.775-.351-.586.41-.689 1.159-.22 1.833 2.157 2.992 3.374 6.967 3.374 11.118 0 4.15-1.247 8.11-3.373 11.118-.455.66-.367 1.422.22 1.818ZM44.504 49.838c.558.38 1.32.249 1.746-.367 1.452-1.907 2.361-4.679 2.361-7.627 0-2.963-.91-5.72-2.361-7.642-.426-.616-1.188-.733-1.746-.352-.645.455-.748 1.247-.25 1.922 1.204 1.642 1.849 3.74 1.849 6.072 0 2.317-.66 4.4-1.848 6.072-.484.675-.396 1.452.25 1.922ZM35.6 58.33c1.145 0 1.922-.836 1.922-1.951V27.412c0-1.115-.777-2.024-1.95-2.024-.807 0-1.364.351-2.2 1.143l-8.2 7.774c-.131.132-.307.19-.527.19h-5.56c-2.346 0-3.71 1.365-3.71 3.858v7.099c0 2.479 1.364 3.843 3.71 3.843h5.56c.22 0 .396.073.528.205l8.198 7.759c.763.719 1.423 1.07 2.23 1.07Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M15.375 23.633h50V60.07h-50z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SpeakIcon
