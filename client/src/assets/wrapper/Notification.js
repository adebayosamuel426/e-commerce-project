import styled from 'styled-components';

const Wrapper = styled.main `
  .notification-wrapper {
  position: relative;
  display: inline-block;
}

.bell-icon {
  font-size: 1.5rem;
  cursor: pointer;
}

.notification-badge {
  position: absolute;
  top: -6px;
  right: -3px;
  background-color: red;
  color: white;
  font-size: 0.7rem;
  padding: 3px 6px;
  border-radius: 50%;
}

.notification-dropdown {
  position: absolute;
  right: 0;
  top: 30px;
  background-color: white;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  padding: 10px;
  z-index: 1000;
}

.notification-item {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.notification-item:last-child {
  border-bottom: none;
}

`;

export default Wrapper;