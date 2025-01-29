import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faBook, faMoneyBill, faChild, faPlus } from '@fortawesome/free-solid-svg-icons';

const iconMap = {
  "📜": faFileAlt,
  "📚": faBook,
  "💰": faMoneyBill,
  "👶": faChild,
  "➕": faPlus
};

const DashboardCard = ({
  title,
  count,
  icon,
  onClick,
  isAddCard = false
}) => {
  return (
    <div>
      <div
        onClick={onClick}
        className="border-2 border-gray-300  rounded-lg p-6 text-gray-800 shadow-lg 
        transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-green-500
        cursor-pointer bg-white"
      >
        <div className="flex flex-col items-center space-y-4">
          <FontAwesomeIcon icon={iconMap[icon]} className="text-4xl" />
          <h2 className="text-xl font-semibold text-center">{title}</h2>
          <div className="text-3xl font-bold">
          </div>
          <p className="text-sm opacity-75">
            {isAddCard ? 'Click to add new' : 'Click to manage'}
          </p>
        </div>
      </div>
    </div>

  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isAddCard: PropTypes.bool
};

export default DashboardCard;
