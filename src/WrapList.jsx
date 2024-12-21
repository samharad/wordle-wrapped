export function WrapList({ width, wraps }) {
  return (
    <div className={"h-full flex flex-col justify-center content-center"}>
      <div className="font-bold text-5xl p-6">
        🎁 Your 2024 Wraps 🎁
      </div>
      <div className={"flex"}>
        {wraps.map((wrap, i) => (
          <div>
            Wrap summary
          </div>
        ))}
      </div>
    </div>
  );
}