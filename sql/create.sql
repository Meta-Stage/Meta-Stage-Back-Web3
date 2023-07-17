DROP SCHEMA IF EXISTS metastage;
CREATE SCHEMA IF NOT EXISTS metastage DEFAULT CHARACTER SET utf8;
USE metastage;

-- --------------------------------

DROP TABLE IF EXISTS metastage.nftinfo;

CREATE TABLE IF NOT EXISTS metastage.nftinfo (
    tokenId INT,
    ownerAddress VARCHAR(45),
    ticketUri VARCHAR(200),
    photoUri VARCHAR(200),
    photoOpened TINYINT(1) NOT NULL DEFAULT '0',
    isRegistered TINYINT(1) NOT NULL DEFAULT '0',
    created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    PRIMARY KEY(tokenId)
);