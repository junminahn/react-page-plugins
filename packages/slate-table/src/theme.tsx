import React from 'react';
import styled from 'styled-components';
import cx from 'clsx';

const defaultStyle = {
  buttonGroup: `
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    font-size: 0em;
    vertical-align: baseline;
    margin: 0em 0.25em 0em 0em;
    -webkit-box-shadow: none;
    box-shadow: none;
    border: 1px solid rgba(34, 36, 38, 0.15);
    border-radius: 0.28571429rem;

    &:after {
        content: ".";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
    
    & .button {
        -webkit-box-flex: 1;
        -ms-flex: 1 0 auto;
        flex: 1 0 auto;
        margin: 0em;
        border-radius: 0em;
        margin: 0px 0px 0px 0px;
    }

    & .button:first-child {
        border-left: none;
        margin-left: 0;
        border-top-left-radius: .28571429rem;
        border-bottom-left-radius: .28571429rem;
    }
  `,
  button: `
    cursor: pointer;
    display: inline-block;
    min-height: 1em;
    outline: none;
    border: none;
    vertical-align: baseline;
    background: #E0E1E2 none;
    color: rgba(0, 0, 0, 0.6);
    margin: 0em 0.25em 0em 0em;
    padding: 0.78571429em;
    text-transform: none;
    text-shadow: none;
    font-weight: bold;
    line-height: 1em;
    font-style: normal;
    text-align: center;
    text-decoration: none;
    border-radius: 0.28571429rem;
    -webkit-box-shadow: 0px 0px 0px 1px transparent inset, 0px 0em 0px 0px rgba(34, 36, 38, 0.15) inset;
    box-shadow: 0px 0px 0px 1px transparent inset, 0px 0em 0px 0px rgba(34, 36, 38, 0.15) inset;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-transition: opacity 0.1s ease, background-color 0.1s ease, color 0.1s ease, background 0.1s ease, -webkit-box-shadow 0.1s ease;
    transition: opacity 0.1s ease, background-color 0.1s ease, color 0.1s ease, background 0.1s ease, -webkit-box-shadow 0.1s ease;
    transition: opacity 0.1s ease, background-color 0.1s ease, color 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;
    transition: opacity 0.1s ease, background-color 0.1s ease, color 0.1s ease, box-shadow 0.1s ease, background 0.1s ease, -webkit-box-shadow 0.1s ease;
    will-change: '';
    -webkit-tap-highlight-color: transparent;

    &:hover {
        background-color: #CACBCD;
        background-image: none;
        -webkit-box-shadow: 0px 0px 0px 1px transparent inset, 0px 0em 0px 0px rgba(34, 36, 38, 0.15) inset;
        box-shadow: 0px 0px 0px 1px transparent inset, 0px 0em 0px 0px rgba(34, 36, 38, 0.15) inset;
        color: rgba(0, 0, 0, 0.8);
    }
    &.active {
        background-color: #C0C1C2;
        background-image: none;
        -webkit-box-shadow: 0px 0px 0px 1px transparent inset;
        box-shadow: 0px 0px 0px 1px transparent inset;
        color: rgba(0, 0, 0, 0.95);
      }
      
    &.active:hover {
        background-color: #C0C1C2;
        background-image: none;
        color: rgba(0, 0, 0, 0.95);
    }
      
    &.active:active {
        background-color: #C0C1C2;
        background-image: none;
    }
  `,
};

export const createTheme = (style = defaultStyle) => {
  const Sbutton: any = styled.button.attrs({ className: 'button' })`
    ${(props: any) => {
      return style.button;
    }}
  `;

  const Button = props => <Sbutton {...props} className={cx('button', props.active === true ? 'active' : '')} />;

  Button.Group = styled.div`
    ${(props: any) => {
      return style.buttonGroup;
    }}
  `;

  return { Button };
};

const { Button } = createTheme();

export const ThemeContext = React.createContext({ Button });
