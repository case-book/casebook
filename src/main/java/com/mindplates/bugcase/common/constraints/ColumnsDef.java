package com.mindplates.bugcase.common.constraints;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public class ColumnsDef {

    public static final int NAME = 100;
    public static final int URL = 200;
    public static final int TOKEN = 200;
    public static final int DATE_STRING = 10;
    public static final int CODE = 50;
    public static final int TEXT = 1000;
    public static final int EMAIL = 200;
    public static final int PASSWORD = 100;
    public static final int PATH = 200;

    public static final String LONGTEXT = "longtext";

}
