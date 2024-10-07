import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const SwitchIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={80}
    height={80}
    fill="none"
    {...props}
  >
    <G fill="#4D7C0F" clipPath="url(#a)">
      <Path d="M27 51.485C27 54.48 28.497 56 31.469 56H47.45c2.972 0 4.469-1.52 4.469-4.515V28.527c0-2.995-1.497-4.515-4.469-4.515H31.47c-2.972 0-4.469 1.52-4.469 4.515v22.958Zm2.054-.047V28.573c0-1.625.86-2.507 2.53-2.507h15.751c1.672 0 2.53.882 2.53 2.507v22.865c0 1.625-.858 2.508-2.53 2.508h-15.75c-1.672 0-2.53-.883-2.53-2.508Z" />
      <Path d="M32.803 41.515c.755 0 1.37-.615 1.37-1.37 0-.766-.615-1.381-1.37-1.381-.754 0-1.381.627-1.381 1.381 0 .743.627 1.37 1.381 1.37Zm4.202-.557h9.68c.453 0 .812-.36.812-.813a.8.8 0 0 0-.812-.812h-9.68a.8.8 0 0 0-.813.812c0 .453.36.813.813.813ZM32.803 36.698c.755 0 1.37-.615 1.37-1.381s-.615-1.37-1.37-1.37a1.375 1.375 0 1 0 0 2.75Zm4.202-.569h9.68a.793.793 0 0 0 .812-.812.79.79 0 0 0-.812-.801h-9.68a.79.79 0 0 0-.813.8c0 .465.349.813.813.813ZM32.803 32.044c.755 0 1.37-.616 1.37-1.382 0-.754-.615-1.37-1.37-1.37a1.39 1.39 0 0 0-1.381 1.37c0 .755.627 1.382 1.381 1.382Zm4.202-.558h9.68a.817.817 0 0 0 .812-.824.807.807 0 0 0-.812-.812h-9.68a.807.807 0 0 0-.813.812c0 .453.36.824.813.824Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M27 24h25.14v32H27z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SwitchIcon
