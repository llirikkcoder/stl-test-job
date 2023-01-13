import styled from 'styled-components';

const ToastMessage = styled.div`
position: fixed;
bottom: 20px;
right: 20px;
padding: 10px;
background-color: rgb(85, 239, 9);
color: #fff;
border-radius: 5px;
font-size: 14px;
visibility: hidden;
opacity: 0;
transition: visibility 0s, opacity 0.5s linear;

&.show {
  visibility: visible;
  opacity: 1;
  transition-delay: 0s;
}
`;

export default ToastMessage;