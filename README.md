# Functional Specs

ScaleHero is a tablet app that will help to learn scales, chords and progressions on the guitar or piano. It lets you create 'lessons' with interactive instruments and backing tracks.

## Concepts

// Rewrite
### Users

Users can sign in with OAuth (Facebook/Twitter). They have 2 places to use the app's features: the back-office where they can manage their content, and the front office where they can use their lessons (and/or other users' lessons).

## Use Case Examples

// TODO

## Back Office Entities

### Styles

A style is a set of visual characteristics for a single instrument square.
Thoses characteristics include:
- a background **color**, rgba format
- a **border** style: width, style, color and radius
- some **textures** from a predetermined set (see (HeroPatters)[https://www.heropatterns.com/] for examples): rgba color, zoom

### Palettes

A palette is a smart set of styles. It maps a style to an interval (see Scales section) or to the empty square.

### Instruments

Instruments come in two types: keyed (piano) and fretted (guitar/violin/...). It is defined by its tuning. For pianos, tuning is a single note describing the C key pitch. For guitars, it is a list of notes describing the open strings pitches.
// Really useful? Variable tuning?

### Masks

Masks are a way to only show hand-picked squares of the instrument. They cannot exceed the width (when horizontal) of an octave. They are independant of the place they will be positioned on the instrument at.
For piano, it consists of an ordered serie of relative square positions. Its length can vary from 0 to 12.
Examples: [] (nothing showing), [ X ] (a single square showing), [X, X+3, X+5] (three squares showing separated first by 2 squares then by 1).
A mask allows to show part of the instrument from its extremity.
Example: [(-Inf, X), (X+3, +Inf)] (all squares from left showing, 2 hidden, then all to right showing)
For guitars it is the same as for piano for each string.
// How to relate masks to instrument's tuning???

### Scales

A scale is an ordered (as pitch) list of intervals (i.e. a mode). It is independant of a key (home pitch).
Intervals can be: 1 (mandatory), b2, 2, #2, bb3, b3, 3, #3, b4, 4, #4, b5, 5, #5, bb6, b6, 6, #6, bb7, b7, 7.
List can contain several similar interval names, but no enharmonic intervals.
Valid examples: [1] (single note scales are OK), [1, b2, #2, 3] (b2 and #2 are OK)
Invalid examples: [] (no notes), [1, b2, #2, b3] (#2 and b3 are enharmonic)

### Backing Tracks

// Todo

--------------------------------
// Rewrite
### Lessons

A lesson is a navigatable set of slides. Each slide contains modules presented within a layout.
Lessons are private (shared with no one) by default, but can be public (shared with everyone) or restreined (shared with selected users).

#### Slide Navigation

Slide navigation acts as a graph. When constructing the lesson, users will express the navigation they wish with this graph's nodes (where a slide is attached) and arrows (swipe left, right, bottom, top). Navigation can be cyclic.
The graph can be clever about 'previous' movements i.e. going from A to B with a right swipe will enable a left swipe back to A if nothing is specified for this movement. If the node is empty and there is no possible 'previous' node the movement is disabled.

#### Slide Layout
