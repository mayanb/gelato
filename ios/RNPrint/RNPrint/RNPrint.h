//
//  RNPrint.h
//  RNPrint
//
//  Created by Maya Balakrishnan on 3/12/18.
//  Copyright © 2018 Maya Balakrishnan. All rights reserved.
//
#import <UIKit/UIKit.h>
#import <React/RCTView.h>
#import <React/RCTBridgeModule.h>

//#import <React/RCTView.h>
//#import <React/RCTBridgeModule.h>

@interface RNPrint : RCTView <RCTBridgeModule, UIPrintInteractionControllerDelegate, UIPrinterPickerControllerDelegate>
@property UIPrinter *pickedPrinter;
@property NSString *filePath;
@property NSString *htmlString;
@property NSURL *printerURL;
@end
