const Outgoing = (
  { outgoing }: { outgoing: Set<string> }
) => {
  const linksArray = Array.from(outgoing); 

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <p className="font-medium text-blue-700">
        Outgoing ({outgoing.size}):
      </p>

      <ul className="mt-2 text-sm text-blue-400 break-all">
        {linksArray.map((link, idx) => (
          <li key={idx}>{link}</li>
        ))}
      </ul>
    </div>
  );
};

export default Outgoing;