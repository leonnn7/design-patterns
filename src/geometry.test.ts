import { RectangleAdapter, Square } from "./geometry";
import { Calculator } from "./geometry.third-party";

test("RectangleAdapter adapts Quadratic as a Rectangular object", () => {
  const square = new Square(3);
  const adapted = new RectangleAdapter(square);
  expect(Calculator.getArea(adapted)).toBeCloseTo(9);
  expect(Calculator.getPerimeter(adapted)).toBeCloseTo(12);
  expect(Calculator.getDiagonal(adapted)).toBeCloseTo(Math.sqrt(18));
});

test("Calculator.getWidthHeightRatio returns correct ratio for RectangleAdapter", () => {
  const square = new Square(4);
  const adapted = new RectangleAdapter(square);
  expect(Calculator.getWidthHeightRatio(adapted)).toBeCloseTo(1.0);

  // Test mit einem Rechteck
  const rectangle = { getWidth: () => 8, getHeight: () => 4 };
  expect(Calculator.getWidthHeightRatio(rectangle)).toBeCloseTo(2.0);
});
