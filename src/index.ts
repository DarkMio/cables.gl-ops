// in theory I'd like it to contain n sides, but meh
// lots of xy, some of them on a grid, some of them are not :thinking:

import { Box, Circle, Collider2d, Polygon, Vector } from "collider2d";
import type CollisionDetails from "collider2d/build/collision_details";
const collider2d = new Collider2d();
// can't see any more new, yo
const vec2 = (x: number, y: number) => new Vector(x, y);

interface Tile {
  style: "light" | "dark";
  type: "tile";
  flipTime: number;
  object: Polygon;
}

interface Ball {
  style: "light" | "dark";
  type: "ball";
  object: Circle;
  direction: Vector;
  bounces?: number;
}

const hitCorner = (ball: Circle, a: Polygon, b: Polygon) => {
  const aHit = collider2d.testCirclePolygon(ball, a);
  if (!aHit) {
    return false;
  }

  const bHit = collider2d.testCirclePolygon(ball, b);
  if (!bHit) {
    return false;
  }

  return true;
};

const hitBounds = (ball: Ball) => {
  const circle = ball.object;
  const minima = circle.position
    .clone()
    .sub(vec2(circle.radius, circle.radius))
    .len();

  if (minima < 0.205) {
    console.log("invert 1");
    return ["invert", undefined] as const;
  }

  const maxima = circle.position
    .clone()
    .add(vec2(circle.radius, circle.radius));

  const dx = maxima.sub(bounds.max).len();
  if (dx < 0.205) {
    console.log("invert 2");
    return ["invert", undefined] as const;
  }

  const edges = [bounds.left, bounds.right, bounds.bottom, bounds.top];
  const { left, bottom, top, right } = bounds;

  for (const edge of edges) {
    const collision = collider2d.testCirclePolygon(
      circle,
      edge,
      true,
    ) as CollisionDetails;

    if (collision.overlap < 1) {
      if (bounds.left === edge || bounds.right === edge) {
        return [true, vec2(0, 1)] as const;
      }
      return [true, vec2(1, 0)] as const;
    }
  }

  return [false, undefined] as const;
};

const hitTile = (ball: Circle, tile: Tile) => {
  const collision = collider2d.testCirclePolygon(ball, tile.object, true) as
    | CollisionDetails
    | false;
  if (!collision) {
    return [false, undefined] as const;
  }

  const { overlapV } = collision;
  if (Math.abs(overlapV.x) > Math.abs(overlapV.y)) {
    return [true, vec2(0, 1)] as const;
  }
  return [true, vec2(1, 0)] as const;
};

const inExec = op.inTrigger("Tick");
const inSpeed = op.inFloat("Speed");
const inRows = op.inFloat("Rows");
const inColumns = op.inFloat("Columns");
const inReset = op.inTriggerButton("Reset");

const balls: Ball[] = [];
const tiles: Tile[] = [];
// poor
const bounds = {
  left: new Polygon(),
  right: new Polygon(),
  top: new Polygon(),
  bottom: new Polygon(),
  span: new Polygon(),
  min: vec2(0, 0),
  max: vec2(10, 10),
};
const outBoard = op.outArray("Board", tiles);
const outBalls = op.outArray("Balls", balls);

outBoard.setRef(tiles);
outBalls.setRef(balls);

const setup = () => {
  const rawRows = inRows.get() || 0;
  const rawColumns = inColumns.get() || 0;
  const inValidRange = rawRows > 0 && rawColumns > 0;
  op.setUiError(
    "row-column-error",
    inValidRange ? null : "Either Rows or Columns is unset",
  );
  if (!inValidRange) {
    return;
  }

  const startTime = Date.now();
  const rows = Math.floor(rawRows);
  const columns = Math.floor(rawColumns);

  bounds.bottom = new Polygon(vec2(0, 0), [
    vec2(-columns, -rows),
    vec2(columns * 2, -rows),
    vec2(columns * 2, 0),
    vec2(-columns, 0),
  ]);
  bounds.top = new Polygon(vec2(0, 0), [
    vec2(-columns, rows),
    vec2(columns * 2, rows),
    vec2(columns * 2, rows * 2),
    vec2(-columns, rows * 2),
  ]);
  bounds.left = new Polygon(vec2(0, 0), [
    vec2(-columns, -rows),
    vec2(0, -rows),
    vec2(0, rows * 2),
    vec2(-columns, rows * 2),
  ]);
  bounds.right = new Polygon(vec2(0, 0), [
    vec2(columns, -rows),
    vec2(columns * 2, -rows),
    vec2(columns * 2, rows * 2),
    vec2(columns, rows * 2),
  ]);
  bounds.span = new Box(
    vec2(columns / 2, rows / 2),
    columns / 2,
    rows / 2,
  ).toPolygon();
  bounds.max = vec2(columns + 0.5, rows + 0.5);

  const newLength = rows * columns;
  // maybe reasonable to keep the board as is, maybe allows for funky stuff?
  if (newLength !== tiles.length) {
    tiles.length = 0;
    for (let i = 0; i < rows * columns; i += 1) {
      // boring: bottom left -> up right addressing
      const x = i % rows;
      const y = (i - x) / columns;

      const aboveHalf = (i + 1) * 2 > newLength;
      tiles.push({
        style: aboveHalf ? "dark" : "light",
        type: "tile",
        flipTime: 0,
        object: new Box(vec2(x, y), 1, 1).toPolygon(),
      });
    }
  }

  balls.length = 0;
  balls.push(
    {
      type: "ball",
      style: "light",
      object: new Circle(vec2(1, 1), 0.5),
      direction: vec2(1, 1),
    },
    {
      type: "ball",
      style: "dark",
      object: new Circle(vec2(rows - 1.5, columns - 1.5), 0.5),
      direction: vec2(-1, -1),
    },
  );
};

inRows.onValueChanged = inColumns.onValueChanged = setup;

const timer = (() => {
  let lastTick = performance.now();
  let deltaTime = 0;
  const tick = () => {
    const currentTick = performance.now();
    deltaTime = Math.min((currentTick - lastTick) / 1000, 0.05);
    lastTick = currentTick;
    // purely for convenience, minor bad practice
    return {
      currentTick,
      deltaTime,
      tick,
    };
  };

  return {
    lastTick,
    deltaTime,
    tick,
  };
})();

inReset.onTriggered = setup;
inExec.onTriggered = () => {
  const speed = inSpeed.get() || 0;
  op.setUiError("speed-error", speed === 0 ? "Speed unset, cannot tick" : null);
  if (speed === 0) {
    return;
  }

  const { deltaTime, currentTick } = timer.tick();

  // const ballCopies = [...balls];
  a: for (let i = 0; i < balls.length; i += 1) {
    const ball = balls[i];

    const delta = ball.direction
      .clone()
      .normalize()
      .scale(speed * deltaTime);

    const imposter = new Circle(
      ball.object.position.clone().add(delta),
      ball.object.radius,
    );
    // let direction = ball.direction;

    const [intersects, axis] = hitBounds({
      direction: ball.direction,
      style: ball.style,
      type: "ball",
      object: imposter,
    });
    if (intersects) {
      if (intersects === "invert") {
        ball.direction.scale(-1, -1);
      } else {
        ball.direction.reflect(axis);
      }
      ball.object.translate(
        ball.direction.x * speed * deltaTime,
        ball.direction.y * speed * deltaTime,
      );

      continue;
    }

    // case b: it hit any edge of a box
    for (const tile of tiles) {
      // if the tile of on the same side, skip it
      if (tile.style === ball.style) {
        continue;
      }
      const [doesIntersect, axis] = hitTile(imposter, tile);
      if (doesIntersect) {
        tile.style = tile.style === "dark" ? "light" : "dark";
        tile.flipTime = currentTick;

        if (ball.bounces === undefined && Math.random() < 0.15) {
          balls.push({
            direction: ball.direction.clone(),
            style: ball.style,
            type: "ball",
            object: new Circle(
              ball.object.position.clone(),
              ball.object.radius,
            ),
            bounces: Math.floor(Math.random() * 4 + 3),
          });
        }

        if (ball.bounces !== undefined) {
          if (ball.bounces <= 0) {
            balls.splice(i, 1);
            continue a;
          }
          ball.bounces -= 1;
        }

        ball.direction.reflect(axis);
        const direction = ball.direction.clone().normalize();
        ball.object.translate(
          direction.x * speed * deltaTime,
          direction.y * speed * deltaTime,
        );
        continue a;
      }
    }

    ball.object.translate(delta.x, delta.y);
  }

  outBalls.set(balls);
  //balls.length = 0;
  // balls.push(...newBalls);
};
