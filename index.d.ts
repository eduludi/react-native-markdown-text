import React from 'react';
import ReactNative from 'react-native';

declare class Markdown extends React.Component<{
  styles?: Record<string, ReactNative.StyleProp>;
  rules?: ParserRules;
  children: string;
  whitelist?: string[];
  blacklist?: string[];
}> {}

export default Markdown;
