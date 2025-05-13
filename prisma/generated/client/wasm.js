
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/wasm.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.11.0
 * Query Engine version: efd2449663b3d73d637ea1fd226bafbcf45b3102
 */
Prisma.prismaVersion = {
  client: "5.11.0",
  engine: "efd2449663b3d73d637ea1fd226bafbcf45b3102"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  firstName: 'firstName',
  lastName: 'lastName',
  phone: 'phone',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BabyScalarFieldEnum = {
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  dateOfBirth: 'dateOfBirth',
  gender: 'gender',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  ownerId: 'ownerId'
};

exports.Prisma.BabyCaregiverScalarFieldEnum = {
  id: 'id',
  relationship: 'relationship',
  permissions: 'permissions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId',
  userId: 'userId'
};

exports.Prisma.EliminationScalarFieldEnum = {
  id: 'id',
  timestamp: 'timestamp',
  type: 'type',
  weight: 'weight',
  success: 'success',
  location: 'location',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId'
};

exports.Prisma.FeedingScalarFieldEnum = {
  id: 'id',
  startTime: 'startTime',
  endTime: 'endTime',
  type: 'type',
  side: 'side',
  amount: 'amount',
  food: 'food',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId'
};

exports.Prisma.SleepScalarFieldEnum = {
  id: 'id',
  startTime: 'startTime',
  endTime: 'endTime',
  how: 'how',
  whereFellAsleep: 'whereFellAsleep',
  whereSlept: 'whereSlept',
  type: 'type',
  quality: 'quality',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId'
};

exports.Prisma.ActivityScalarFieldEnum = {
  id: 'id',
  startTime: 'startTime',
  endTime: 'endTime',
  type: 'type',
  description: 'description',
  milestone: 'milestone',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId'
};

exports.Prisma.MilestoneScalarFieldEnum = {
  id: 'id',
  date: 'date',
  category: 'category',
  title: 'title',
  description: 'description',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId'
};

exports.Prisma.HealthRecordScalarFieldEnum = {
  id: 'id',
  timestamp: 'timestamp',
  type: 'type',
  value: 'value',
  description: 'description',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId'
};

exports.Prisma.MeasurementScalarFieldEnum = {
  id: 'id',
  date: 'date',
  weight: 'weight',
  height: 'height',
  headCirc: 'headCirc',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId'
};

exports.Prisma.AlbumScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId'
};

exports.Prisma.PhotoScalarFieldEnum = {
  id: 'id',
  url: 'url',
  caption: 'caption',
  timestamp: 'timestamp',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BabyPhotoScalarFieldEnum = {
  babyId: 'babyId',
  photoId: 'photoId',
  createdAt: 'createdAt'
};

exports.Prisma.AlbumPhotoScalarFieldEnum = {
  albumId: 'albumId',
  photoId: 'photoId',
  createdAt: 'createdAt'
};

exports.Prisma.ActivityPhotoScalarFieldEnum = {
  activityId: 'activityId',
  photoId: 'photoId',
  createdAt: 'createdAt'
};

exports.Prisma.MilestonePhotoScalarFieldEnum = {
  milestoneId: 'milestoneId',
  photoId: 'photoId',
  createdAt: 'createdAt'
};

exports.Prisma.AlbumAccessScalarFieldEnum = {
  id: 'id',
  permissions: 'permissions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  albumId: 'albumId',
  userId: 'userId'
};

exports.Prisma.PostScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  authorId: 'authorId'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  content: 'content',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  postId: 'postId',
  authorId: 'authorId'
};

exports.Prisma.ParentInviteScalarFieldEnum = {
  id: 'id',
  email: 'email',
  babyId: 'babyId',
  senderId: 'senderId',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  Baby: 'Baby',
  BabyCaregiver: 'BabyCaregiver',
  Elimination: 'Elimination',
  Feeding: 'Feeding',
  Sleep: 'Sleep',
  Activity: 'Activity',
  Milestone: 'Milestone',
  HealthRecord: 'HealthRecord',
  Measurement: 'Measurement',
  Album: 'Album',
  Photo: 'Photo',
  BabyPhoto: 'BabyPhoto',
  AlbumPhoto: 'AlbumPhoto',
  ActivityPhoto: 'ActivityPhoto',
  MilestonePhoto: 'MilestonePhoto',
  AlbumAccess: 'AlbumAccess',
  Post: 'Post',
  Comment: 'Comment',
  ParentInvite: 'ParentInvite'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/Users/marianaenriquez/Documents/babylog/prisma/generated/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "darwin-arm64",
        "native": true
      }
    ],
    "previewFeatures": [
      "driverAdapters"
    ],
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../..",
  "clientVersion": "5.11.0",
  "engineVersion": "efd2449663b3d73d637ea1fd226bafbcf45b3102",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  previewFeatures = [\"driverAdapters\"]\n  output   = \"generated/client\"\n}\n\ndatasource db {\n  provider  = \"postgresql\"\n  url       = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id           Int      @id @default(autoincrement())\n  email        String   @unique\n  passwordHash String\n  firstName    String   @default(\"Unknown\")\n  lastName     String   @default(\"User\")\n  phone        String?\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  babies      BabyCaregiver[]\n  ownedBabies Baby[]          @relation(\"BabyOwner\")\n  posts       Post[]\n  comments    Comment[]\n\n  ParentInvite ParentInvite[]\n  AlbumAccess  AlbumAccess[]\n\n  @@index([email])\n}\n\nmodel Baby {\n  id          Int      @id @default(autoincrement())\n  firstName   String\n  lastName    String\n  dateOfBirth DateTime\n  gender      String?\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  owner              User            @relation(\"BabyOwner\", fields: [ownerId], references: [id], onDelete: Cascade)\n  ownerId            Int\n  caregivers         BabyCaregiver[]\n  eliminations       Elimination[]\n  feedings           Feeding[]\n  sleepsleepSessions Sleep[]\n  activities         Activity[]\n  photos             BabyPhoto[]\n  milestones         Milestone[]\n  healthRecords      HealthRecord[]\n  measurements       Measurement[]\n  albums             Album[]\n  parentInvites      ParentInvite[]\n\n  @@index([dateOfBirth])\n}\n\nmodel BabyCaregiver {\n  id           Int      @id @default(autoincrement())\n  relationship String\n  permissions  String[]\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  baby   Baby @relation(fields: [babyId], references: [id], onDelete: Cascade)\n  babyId Int\n  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)\n  userId Int\n\n  @@unique([babyId, userId])\n  @@index([babyId])\n  @@index([userId])\n}\n\nmodel Elimination {\n  id        Int      @id @default(autoincrement())\n  timestamp DateTime\n  type      String\n  weight    Float?\n  success   Boolean\n  location  String?\n  notes     String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  baby   Baby @relation(fields: [babyId], references: [id], onDelete: Cascade)\n  babyId Int\n\n  @@index([timestamp])\n  @@index([babyId, timestamp])\n}\n\nmodel Feeding {\n  id        Int       @id @default(autoincrement())\n  startTime DateTime\n  endTime   DateTime?\n  type      String\n  side      String?\n  amount    Float?\n  food      String?\n  notes     String?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  baby   Baby @relation(fields: [babyId], references: [id], onDelete: Cascade)\n  babyId Int\n\n  @@index([startTime])\n  @@index([babyId, startTime])\n}\n\nmodel Sleep {\n  id              Int       @id @default(autoincrement())\n  startTime       DateTime\n  endTime         DateTime?\n  how             String?\n  whereFellAsleep String?\n  whereSlept      String?\n  type            String\n  quality         Int?\n  notes           String?\n  createdAt       DateTime  @default(now())\n  updatedAt       DateTime  @updatedAt\n\n  baby   Baby @relation(fields: [babyId], references: [id], onDelete: Cascade)\n  babyId Int\n\n  @@index([startTime])\n  @@index([babyId, startTime])\n}\n\nmodel Activity {\n  id          Int       @id @default(autoincrement())\n  startTime   DateTime\n  endTime     DateTime?\n  type        String\n  description String?\n  milestone   Boolean   @default(false)\n  notes       String?\n  createdAt   DateTime  @default(now())\n  updatedAt   DateTime  @updatedAt\n\n  baby   Baby            @relation(fields: [babyId], references: [id], onDelete: Cascade)\n  babyId Int\n  photos ActivityPhoto[]\n\n  @@index([startTime])\n  @@index([babyId, startTime])\n}\n\nmodel Milestone {\n  id          Int      @id @default(autoincrement())\n  date        DateTime\n  category    String\n  title       String\n  description String?\n  notes       String?\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  baby   Baby             @relation(fields: [babyId], references: [id], onDelete: Cascade)\n  babyId Int\n  photos MilestonePhoto[]\n\n  @@index([date])\n  @@index([babyId, date])\n}\n\nmodel HealthRecord {\n  id          Int      @id @default(autoincrement())\n  timestamp   DateTime\n  type        String\n  value       Float?\n  description String?\n  notes       String?\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  baby   Baby @relation(fields: [babyId], references: [id], onDelete: Cascade)\n  babyId Int\n\n  @@index([timestamp])\n  @@index([babyId, timestamp])\n}\n\nmodel Measurement {\n  id        Int      @id @default(autoincrement())\n  date      DateTime\n  weight    Float?\n  height    Float?\n  headCirc  Float?\n  notes     String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  baby   Baby @relation(fields: [babyId], references: [id], onDelete: Cascade)\n  babyId Int\n\n  @@index([date])\n  @@index([babyId, date])\n}\n\nmodel Album {\n  id          Int      @id @default(autoincrement())\n  title       String\n  description String?\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  baby   Baby          @relation(fields: [babyId], references: [id], onDelete: Cascade)\n  babyId Int\n  photos AlbumPhoto[]\n  access AlbumAccess[]\n\n  @@index([babyId])\n}\n\nmodel Photo {\n  id        Int      @id @default(autoincrement())\n  url       String\n  caption   String?\n  timestamp DateTime\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  babyPhotos      BabyPhoto[]\n  albumPhotos     AlbumPhoto[]\n  activityPhotos  ActivityPhoto[]\n  milestonePhotos MilestonePhoto[]\n\n  @@index([timestamp])\n}\n\nmodel BabyPhoto {\n  baby      Baby     @relation(fields: [babyId], references: [id], onDelete: Cascade)\n  babyId    Int\n  photo     Photo    @relation(fields: [photoId], references: [id], onDelete: Cascade)\n  photoId   Int\n  createdAt DateTime @default(now())\n\n  @@id([babyId, photoId])\n  @@index([babyId])\n  @@index([photoId])\n}\n\nmodel AlbumPhoto {\n  album     Album    @relation(fields: [albumId], references: [id], onDelete: Cascade)\n  albumId   Int\n  photo     Photo    @relation(fields: [photoId], references: [id], onDelete: Cascade)\n  photoId   Int\n  createdAt DateTime @default(now())\n\n  @@id([albumId, photoId])\n  @@index([albumId])\n  @@index([photoId])\n}\n\nmodel ActivityPhoto {\n  activity   Activity @relation(fields: [activityId], references: [id], onDelete: Cascade)\n  activityId Int\n  photo      Photo    @relation(fields: [photoId], references: [id], onDelete: Cascade)\n  photoId    Int\n  createdAt  DateTime @default(now())\n\n  @@id([activityId, photoId])\n  @@index([activityId])\n  @@index([photoId])\n}\n\nmodel MilestonePhoto {\n  milestone   Milestone @relation(fields: [milestoneId], references: [id], onDelete: Cascade)\n  milestoneId Int\n  photo       Photo     @relation(fields: [photoId], references: [id], onDelete: Cascade)\n  photoId     Int\n  createdAt   DateTime  @default(now())\n\n  @@id([milestoneId, photoId])\n  @@index([milestoneId])\n  @@index([photoId])\n}\n\nmodel AlbumAccess {\n  id          Int      @id @default(autoincrement())\n  permissions String[]\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  album   Album @relation(fields: [albumId], references: [id], onDelete: Cascade)\n  albumId Int\n  user    User  @relation(fields: [userId], references: [id], onDelete: Cascade)\n  userId  Int\n\n  @@unique([albumId, userId])\n  @@index([albumId])\n  @@index([userId])\n}\n\nmodel Post {\n  id        Int      @id @default(autoincrement())\n  title     String\n  content   String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  author   User      @relation(fields: [authorId], references: [id], onDelete: Cascade)\n  authorId Int\n  comments Comment[]\n\n  @@index([authorId])\n}\n\nmodel Comment {\n  id        Int      @id @default(autoincrement())\n  content   String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  post     Post @relation(fields: [postId], references: [id], onDelete: Cascade)\n  postId   Int\n  author   User @relation(fields: [authorId], references: [id], onDelete: Cascade)\n  authorId Int\n\n  @@index([postId])\n  @@index([authorId])\n}\n\nmodel ParentInvite {\n  id        Int      @id @default(autoincrement())\n  email     String\n  babyId    Int\n  baby      Baby     @relation(fields: [babyId], references: [id])\n  senderId  Int\n  sentBy    User     @relation(fields: [senderId], references: [id])\n  status    String   @default(\"PENDING\") // PENDING, ACCEPTED, DECLINED\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([email, babyId])\n  @@index([senderId])\n}\n",
  "inlineSchemaHash": "f454fb9d1c6409e2c30a35390ff312d8fd9b07b484bf78b2a2223594fafa8c14",
  "copyEngine": false
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"passwordHash\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"firstName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lastName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"babies\",\"kind\":\"object\",\"type\":\"BabyCaregiver\",\"relationName\":\"BabyCaregiverToUser\"},{\"name\":\"ownedBabies\",\"kind\":\"object\",\"type\":\"Baby\",\"relationName\":\"BabyOwner\"},{\"name\":\"posts\",\"kind\":\"object\",\"type\":\"Post\",\"relationName\":\"PostToUser\"},{\"name\":\"comments\",\"kind\":\"object\",\"type\":\"Comment\",\"relationName\":\"CommentToUser\"},{\"name\":\"ParentInvite\",\"kind\":\"object\",\"type\":\"ParentInvite\",\"relationName\":\"ParentInviteToUser\"},{\"name\":\"AlbumAccess\",\"kind\":\"object\",\"type\":\"AlbumAccess\",\"relationName\":\"AlbumAccessToUser\"}],\"dbName\":null},\"Baby\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"firstName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lastName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"dateOfBirth\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"gender\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"owner\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"BabyOwner\"},{\"name\":\"ownerId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"caregivers\",\"kind\":\"object\",\"type\":\"BabyCaregiver\",\"relationName\":\"BabyToBabyCaregiver\"},{\"name\":\"eliminations\",\"kind\":\"object\",\"type\":\"Elimination\",\"relationName\":\"BabyToElimination\"},{\"name\":\"feedings\",\"kind\":\"object\",\"type\":\"Feeding\",\"relationName\":\"BabyToFeeding\"},{\"name\":\"sleepsleepSessions\",\"kind\":\"object\",\"type\":\"Sleep\",\"relationName\":\"BabyToSleep\"},{\"name\":\"activities\",\"kind\":\"object\",\"type\":\"Activity\",\"relationName\":\"ActivityToBaby\"},{\"name\":\"photos\",\"kind\":\"object\",\"type\":\"BabyPhoto\",\"relationName\":\"BabyToBabyPhoto\"},{\"name\":\"milestones\",\"kind\":\"object\",\"type\":\"Milestone\",\"relationName\":\"BabyToMilestone\"},{\"name\":\"healthRecords\",\"kind\":\"object\",\"type\":\"HealthRecord\",\"relationName\":\"BabyToHealthRecord\"},{\"name\":\"measurements\",\"kind\":\"object\",\"type\":\"Measurement\",\"relationName\":\"BabyToMeasurement\"},{\"name\":\"albums\",\"kind\":\"object\",\"type\":\"Album\",\"relationName\":\"AlbumToBaby\"},{\"name\":\"parentInvites\",\"kind\":\"object\",\"type\":\"ParentInvite\",\"relationName\":\"BabyToParentInvite\"}],\"dbName\":null},\"BabyCaregiver\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"relationship\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"permissions\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"baby\",\"kind\":\"object\",\"type\":\"Baby\",\"relationName\":\"BabyToBabyCaregiver\"},{\"name\":\"babyId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"BabyCaregiverToUser\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"Int\"}],\"dbName\":null},\"Elimination\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"timestamp\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"weight\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"success\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"location\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"baby\",\"kind\":\"object\",\"type\":\"Baby\",\"relationName\":\"BabyToElimination\"},{\"name\":\"babyId\",\"kind\":\"scalar\",\"type\":\"Int\"}],\"dbName\":null},\"Feeding\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"startTime\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endTime\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"side\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"food\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"baby\",\"kind\":\"object\",\"type\":\"Baby\",\"relationName\":\"BabyToFeeding\"},{\"name\":\"babyId\",\"kind\":\"scalar\",\"type\":\"Int\"}],\"dbName\":null},\"Sleep\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"startTime\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endTime\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"how\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"whereFellAsleep\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"whereSlept\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"quality\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"baby\",\"kind\":\"object\",\"type\":\"Baby\",\"relationName\":\"BabyToSleep\"},{\"name\":\"babyId\",\"kind\":\"scalar\",\"type\":\"Int\"}],\"dbName\":null},\"Activity\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"startTime\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endTime\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"milestone\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"baby\",\"kind\":\"object\",\"type\":\"Baby\",\"relationName\":\"ActivityToBaby\"},{\"name\":\"babyId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"photos\",\"kind\":\"object\",\"type\":\"ActivityPhoto\",\"relationName\":\"ActivityToActivityPhoto\"}],\"dbName\":null},\"Milestone\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"date\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"category\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"baby\",\"kind\":\"object\",\"type\":\"Baby\",\"relationName\":\"BabyToMilestone\"},{\"name\":\"babyId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"photos\",\"kind\":\"object\",\"type\":\"MilestonePhoto\",\"relationName\":\"MilestoneToMilestonePhoto\"}],\"dbName\":null},\"HealthRecord\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"timestamp\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"value\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"baby\",\"kind\":\"object\",\"type\":\"Baby\",\"relationName\":\"BabyToHealthRecord\"},{\"name\":\"babyId\",\"kind\":\"scalar\",\"type\":\"Int\"}],\"dbName\":null},\"Measurement\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"date\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"weight\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"height\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"headCirc\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"baby\",\"kind\":\"object\",\"type\":\"Baby\",\"relationName\":\"BabyToMeasurement\"},{\"name\":\"babyId\",\"kind\":\"scalar\",\"type\":\"Int\"}],\"dbName\":null},\"Album\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"baby\",\"kind\":\"object\",\"type\":\"Baby\",\"relationName\":\"AlbumToBaby\"},{\"name\":\"babyId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"photos\",\"kind\":\"object\",\"type\":\"AlbumPhoto\",\"relationName\":\"AlbumToAlbumPhoto\"},{\"name\":\"access\",\"kind\":\"object\",\"type\":\"AlbumAccess\",\"relationName\":\"AlbumToAlbumAccess\"}],\"dbName\":null},\"Photo\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"url\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"caption\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"timestamp\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"babyPhotos\",\"kind\":\"object\",\"type\":\"BabyPhoto\",\"relationName\":\"BabyPhotoToPhoto\"},{\"name\":\"albumPhotos\",\"kind\":\"object\",\"type\":\"AlbumPhoto\",\"relationName\":\"AlbumPhotoToPhoto\"},{\"name\":\"activityPhotos\",\"kind\":\"object\",\"type\":\"ActivityPhoto\",\"relationName\":\"ActivityPhotoToPhoto\"},{\"name\":\"milestonePhotos\",\"kind\":\"object\",\"type\":\"MilestonePhoto\",\"relationName\":\"MilestonePhotoToPhoto\"}],\"dbName\":null},\"BabyPhoto\":{\"fields\":[{\"name\":\"baby\",\"kind\":\"object\",\"type\":\"Baby\",\"relationName\":\"BabyToBabyPhoto\"},{\"name\":\"babyId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"photo\",\"kind\":\"object\",\"type\":\"Photo\",\"relationName\":\"BabyPhotoToPhoto\"},{\"name\":\"photoId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"AlbumPhoto\":{\"fields\":[{\"name\":\"album\",\"kind\":\"object\",\"type\":\"Album\",\"relationName\":\"AlbumToAlbumPhoto\"},{\"name\":\"albumId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"photo\",\"kind\":\"object\",\"type\":\"Photo\",\"relationName\":\"AlbumPhotoToPhoto\"},{\"name\":\"photoId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"ActivityPhoto\":{\"fields\":[{\"name\":\"activity\",\"kind\":\"object\",\"type\":\"Activity\",\"relationName\":\"ActivityToActivityPhoto\"},{\"name\":\"activityId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"photo\",\"kind\":\"object\",\"type\":\"Photo\",\"relationName\":\"ActivityPhotoToPhoto\"},{\"name\":\"photoId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"MilestonePhoto\":{\"fields\":[{\"name\":\"milestone\",\"kind\":\"object\",\"type\":\"Milestone\",\"relationName\":\"MilestoneToMilestonePhoto\"},{\"name\":\"milestoneId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"photo\",\"kind\":\"object\",\"type\":\"Photo\",\"relationName\":\"MilestonePhotoToPhoto\"},{\"name\":\"photoId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"AlbumAccess\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"permissions\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"album\",\"kind\":\"object\",\"type\":\"Album\",\"relationName\":\"AlbumToAlbumAccess\"},{\"name\":\"albumId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AlbumAccessToUser\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"Int\"}],\"dbName\":null},\"Post\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"PostToUser\"},{\"name\":\"authorId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"comments\",\"kind\":\"object\",\"type\":\"Comment\",\"relationName\":\"CommentToPost\"}],\"dbName\":null},\"Comment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"post\",\"kind\":\"object\",\"type\":\"Post\",\"relationName\":\"CommentToPost\"},{\"name\":\"postId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CommentToUser\"},{\"name\":\"authorId\",\"kind\":\"scalar\",\"type\":\"Int\"}],\"dbName\":null},\"ParentInvite\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"babyId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"baby\",\"kind\":\"object\",\"type\":\"Baby\",\"relationName\":\"BabyToParentInvite\"},{\"name\":\"senderId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"sentBy\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ParentInviteToUser\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

