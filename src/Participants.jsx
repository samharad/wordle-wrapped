export default function Participants({ hist, names, setNames }) {
  const ps = [...new Set(hist.map(x => x.person))];
  const nameChangeHandler = p => e => {
    setNames({ ...names, [p]: e.target.value });
  }
  return (
    <>
      <div className="border rounded bg-white text-dark-green">
        <div className="text-2xl font-bold">Participants</div>
        {ps.map((p, i) =>
          <div key={i}>
            {p}{"\t"}
            <input defaultValue={names[p] || p}
                   onChange={nameChangeHandler(p)}/>
          </div>
        )}
      </div>
    </>
  )
}