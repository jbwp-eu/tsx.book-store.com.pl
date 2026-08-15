const Image = ({ image, className }: { image: string; className?: string }) => {
  let picture;

  if (image.slice(0, 5) === "https") {
    picture = <img src={image} alt="image" className={className} />;
  } else {
    picture = (
      <img src={`/images/${image}.jpg`} alt="image" className={className} />
    );
  }

  return picture;
};

export default Image;
