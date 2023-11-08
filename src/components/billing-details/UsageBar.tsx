const UsageBar = ({ usagePercentage }) => {
  // Ensure usagePercentage is between 0 and 100
  const safeUsagePercentage = Math.min(100, Math.max(0, usagePercentage));

  let bgColor;
  if (safeUsagePercentage <= 33) {
    bgColor = "bg-green-600";
  } else if (safeUsagePercentage <= 66) {
    bgColor = "bg-orange-600";
  } else if (safeUsagePercentage <= 99) {
    bgColor = "bg-red-600";
  } else {
    bgColor = "bg-purple-600";
  }

  return (
    <div className="relative h-5 rounded-full bg-gray-300">
      <div
        style={{ width: `${safeUsagePercentage}%` }}
        className={`absolute h-full rounded-full ${bgColor}`}
      ></div>
    </div>
  );
};

export default UsageBar;
