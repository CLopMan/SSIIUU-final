#include <iostream> 

int main () {
    printf("\n");
    
    char c = getc(stdin);
    while (c != EOF) {
        if (c == '\n') {
            for (int i = 0; i < 3; ++i) {
                c = getc(stdin);
            }
        } else if (c != ' ') {
            printf("%c", c);
        }
        c = getc(stdin);
    }    
    

}