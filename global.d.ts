// Fallback: allow `className` and similar props inside JSX for common RN elements
declare namespace JSX {
  interface IntrinsicAttributes {
    className?: string;
    contentContainerClassName?: string;
  }

  interface IntrinsicElements {
    View: any;
    Text: any;
    ScrollView: any;
    ImageBackground: any;
    TouchableOpacity: any;
    Image: any;
  }
}
