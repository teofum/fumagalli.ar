interface Props {
  value: number;
}

export default function MinesweeperNumberDisplay({ value }: Props) {
  const digits = [
    value < 0 ? '-minus' : ~~((value / 100) % 10),
    ~~((Math.abs(value) / 10) % 10),
    ~~(Math.abs(value) % 10),
  ];

  return (
    <div className="bg-surface bevel-light-inset p-px flex flex-row">
      {digits.map((d, i) => (
        <img
          key={i}
          src={`/fs/Applications/mine/resources/num${d}.png`}
          alt={d.toString()}
        />
      ))}
    </div>
  );
}
