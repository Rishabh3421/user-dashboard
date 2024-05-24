import React from 'react';

const UserLogo: React.FC<{ name: string }> = ({ name }) => {
  const firstLetter = name.charAt(0).toUpperCase();

  // Generate a random background color
  const randomColor = () => {
   const colors = [
      '#ff5733', '#ffa600', '#ffdc3d', '#ffbf00', '#ff4500',
      '#ff6347', '#ff8c00', '#ffd700', '#ffdab9', '#ffa07a'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="userLogo" style={{ backgroundColor: randomColor() }}>
      {firstLetter}
    </div>
  );
};

export default UserLogo;
