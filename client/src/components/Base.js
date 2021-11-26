import styled from "styled-components"

export const Box = styled.div`
    width: ${props => props.width ? props.width : "20vw"};
    height: ${props => props.height ? props.height : "25vh"};
    background-color: #dbbe8d;
    border-radius: 10px;
    padding: 20px;
    border: 5px solid #565049;

    font-size: 16px;
    font-weight: 500;
    text-align: center;
    line-height: 22px;

    display: flex;
    flex-direction: column;

    @media only screen and (max-width: 1200px) {
        padding: 10px;
        font-size: 14px;
        line-height: 18px;
    }

    ${props => props.fade && `
        animation: fadeIn 1s;
        -webkit-animation: fadeIn 1s;
        -moz-animation: fadeIn 1s;
        -o-animation: fadeIn 1s;
        -ms-animation: fadeIn 1s;

        @keyframes fadeIn {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }

        @-moz-keyframes fadeIn {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }

        @-webkit-keyframes fadeIn {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }

        @-o-keyframes fadeIn {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }

        @-ms-keyframes fadeIn {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
    
    `}

`

export const Button = styled.div`

    background-color: #dbbe8d;
    border-radius: 10px;
    border: 3px solid #565049;

    padding: 5px 20px 5px 20px;
    margin-top: 12px;
    font-size: 16px;
    line-height: 18px;
    font-weight: bold;

    text-align: center;

    ${props => props.disabled
        ?
        `
        opacity: 0.2;
    `
        :
        `
        cursor: pointer;
        :hover {
        opacity: 0.9;
        }
    `
    }


    
    @media only screen and (max-width: 1200px) {
        padding: 5px 10px 5px 10px;
        font-size: 14px;
        line-height: 16px;
    }


`

export const Buttons = styled.div`
  flex-direction: row;
  display: flex;
  margin-top: 20px;

  div {
    flex: 50%;

    margin-left: 5px;
  }

  @media only screen and (max-width: 1600px) {
    margin-top: 10px;
  }

  @media only screen and (max-width: 1200px) {
    margin-top: 0px;
  }

`