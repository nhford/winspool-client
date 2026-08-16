type TitleProps = {
  title: string;
  subTitle: string;
};

function Trophy() {
  return (
    <img
      src="/site_logos/basketball.png"
      alt="trophy"
      className="h-12 w-auto sm:h-16"
    />
  );
}

export default function Title({ title, subTitle }: TitleProps) {
  return (
    <div>
      <div className="mt-4 flex items-center justify-center gap-1">
        <Trophy />
        <h1 className="mx-1 my-1 text-3xl leading-tight font-normal sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <Trophy />
      </div>
      <p className="px-4 text-sm sm:text-base">{subTitle}</p>
    </div>
  );
}
